import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateStaffDto } from 'src/staffs/dto/request/create-staff.dto';
import { CompaniesService } from 'src/companies/companies.service';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { makeResponse } from 'src/utils';
import { StaffsQueryDto } from './dto/request/staffs-query.dto';
import { StaffItemListDto } from './dto/response/staffs.dto';
import { STAFF_ORDER_BY } from './staffs.constant';
import { UpdateStaffDto } from './dto/request/update-staff.dto';
import { StaffNotFoundException } from 'src/exceptions/staff-not-found-exception';

@Injectable()
export class StaffsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly companiesService: CompaniesService,
  ) {}

  async findByStaffId(id: number) {
    return this.prismaService.staff.findFirst({
      where: {
        id: id,
      },
    });
  }

  async checkCompanyInfor(currentUser: UserJwt, companyCd?: string) {
    const company = await this.companiesService.findCompanyByCd(companyCd);
    switch (currentUser.roleDiv) {
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        return Boolean(company);
      case USER_ROLE.PC:
        return Boolean(company) && company.companyCd === currentUser.companyCd;
      default:
        return false;
    }
  }

  async getListStaff(searchParams: StaffsQueryDto, currentUser: UserJwt) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (currentUser.roleDiv === USER_ROLE.PC) {
      where.companyCd = currentUser.companyCd;
    }
    if (searchParams.id) {
      where.id = Number(searchParams.id);
    }
    if (searchParams.staffName) {
      where.staffName = {
        contains: searchParams.staffName,
      };
    }

    if (searchParams.companyCd) {
      where.companyCd = searchParams.companyCd;
    }

    // Logic pagination
    const pagination = {
      take:
        +searchParams.perPage > 0
          ? +searchParams.perPage
          : DEFAULT_LIMIT_FOR_PAGINATION,
      skip: DEFAULT_OFFSET,
      orderBy: undefined,
    };
    if (+searchParams.offset >= 0) {
      pagination.skip = +searchParams.offset * pagination.take;
    }
    const sortDir =
      searchParams.sortDir &&
      [DEFAULT_ORDER_DIRECTION_DESC, DEFAULT_ORDER_DIRECTION_ASC].includes(
        searchParams.sortDir.toLowerCase(),
      )
        ? searchParams.sortDir.toLowerCase()
        : DEFAULT_ORDER_DIRECTION_DESC;
    if (searchParams.sortBy) {
      if (searchParams.sortBy !== STAFF_ORDER_BY.COMPANY_NAME) {
        pagination.orderBy = {
          [searchParams.sortBy]: sortDir,
        };
      } else {
        pagination.orderBy = {
          company: {
            companyName: sortDir,
          },
        };
      }
    } else {
      pagination.orderBy = {
        [STAFF_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, staffs] = await Promise.all([
      this.prismaService.staff.count({
        where,
      }),
      this.prismaService.staff.findMany({
        where,
        ...pagination,
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
        },
      }),
    ]);

    const formattedStaffs = staffs.map((staff) => {
      const omitFields = ['company', 'createdBy', 'updatedBy', 'companyId'];
      return {
        ...omit(staff, omitFields),
        companyName: staff.company?.companyName,
      } as StaffItemListDto;
    });

    return {
      items: formattedStaffs,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  async createStaff(staff: CreateStaffDto, currentUser: UserJwt) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    // Check company existing
    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      staff.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    // Create staff
    await this.prismaService.$transaction(
      async (trx) => {
        const createdStaff = await trx.staff.create({
          data: {
            staffName: staff.staffName,
            staffNameKana: staff.staffNameKana,
            companyCd: staff.companyCd,
            // createdBy: currentUser.mUserId,
            // updatedBy: currentUser.mUserId,
          },
        });
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async updateStaff(
    updatingStaff: UpdateStaffDto,
    id: number,
    currentUser: UserJwt,
  ) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    const staff = await this.findByStaffId(id);
    if (!staff) {
      throw new StaffNotFoundException(HttpStatus.BAD_REQUEST);
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      updatingStaff.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = ['id', 'createdBy'];
        let companyId = staff.companyCd;
        const updatedUser = await trx.staff.update({
          where: {
            id,
          },
          data: {
            staffName: updatingStaff.staffName,
            staffNameKana: updatingStaff.staffNameKana,
            // companyCd: updatingStaff.companyId,
            // ...omit(updatingStaff, omitFields),
            // updatedBy: currentUser.mUserId,
          },
        });
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async deleteStaff(id: number, currentUser: UserJwt) {
    const staff = await this.findByStaffId(id);
    if (!staff) {
      throw new BadRequestException(
        'The user to be deleted could not be found in the database',
      );
    }
    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      staff.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.staff.delete({
      where: {
        id,
      },
    });
    return makeResponse(HttpStatus.OK);
  }

  async getStaffDetail(id: number, currentUser: UserJwt) {
    const staff = await this.findByStaffId(id);
    // user.roleDiv = user.roleDiv.trim();
    // user.companyId = user.com.trim();

    if (!staff) {
      throw new NotFoundException();
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      staff.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    return staff;
  }
}
