import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateBaseDto } from 'src/bases/dto/request/create-base.dto';
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
import { BasesQueryDto } from './dto/request/bases-query.dto';
import { BaseItemListDto } from './dto/response/bases.dto';
import { BASE_ORDER_BY } from './bases.constant';
import { UpdateBaseDto } from './dto/request/update-base.dto';
import { BaseNotFoundException } from 'src/exceptions/base-not-found-exception';

@Injectable()
export class BasesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly companiesService: CompaniesService,
  ) {}

  async findByBaseId(id: number) {
    return this.prismaService.base.findFirst({
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

  async getListBase(searchParams: BasesQueryDto, currentUser: UserJwt) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (currentUser.roleDiv === USER_ROLE.PC) {
      where.companyCd = currentUser.companyCd;
    }
    if (searchParams.id) {
      where.id = Number(searchParams.id) ? Number(searchParams.id) : 0;
    }
    if (searchParams.baseName) {
      where.baseName = {
        contains: searchParams.baseName,
      };
    }

    if (searchParams.companyCd) {
      where.companyCd = Number(searchParams.companyCd);
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
      if (searchParams.sortBy !== BASE_ORDER_BY.COMPANY_NAME) {
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
        [BASE_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, bases] = await Promise.all([
      this.prismaService.base.count({
        where,
      }),
      this.prismaService.base.findMany({
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

    const formattedBases = bases.map((base) => {
      const omitFields = ['company', 'createdBy', 'updatedBy', 'companyId'];
      return {
        ...omit(base, omitFields),
        baseDiv: Number(base.baseDiv),
        companyName: base.company?.companyName,
      } as BaseItemListDto;
    });

    return {
      items: formattedBases,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  async createBase(base: CreateBaseDto, currentUser: UserJwt) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    // Check company existing
    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      base.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    // Create base
    await this.prismaService.$transaction(
      async (trx) => {
        const createdBase = await trx.base.create({
          data: {
            baseName: base.baseName,
            baseNameKana: base.baseNameKana,
            companyCd: base.companyCd,
            baseDiv: '0',
            telNumber: base.telNumber,
            postCd: base.postCode,
            address1: base.address1,
            address2: base.address2,
            address3: base.address3,
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

  async updateBase(
    updatingBase: UpdateBaseDto,
    id: number,
    currentUser: UserJwt,
  ) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    const base = await this.findByBaseId(id);
    if (!base) {
      throw new BaseNotFoundException(HttpStatus.BAD_REQUEST);
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      updatingBase.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.$transaction(
      async (trx) => {
        // const omitFields = ['id', 'createdBy', 'companyId'];
        // let companyCd = base.companyCd;
        // const updatedBase =

        await trx.base.update({
          where: {
            id,
          },
          data: {
            baseName: updatingBase.baseName,
            baseNameKana: updatingBase.baseNameKana,
            telNumber: updatingBase.telNumber,
            postCd: updatingBase.postCode,
            address1: updatingBase.address1,
            address2: updatingBase.address2,
            address3: updatingBase.address3,
          },
        });
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async deleteBase(id: number, currentUser: UserJwt) {
    const base = await this.findByBaseId(id);
    if (!base) {
      throw new BadRequestException(
        'The base to be deleted could not be found in the database',
      );
    }
    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      base.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.base.delete({
      where: {
        id,
      },
    });
    return makeResponse(HttpStatus.OK);
  }

  async getBaseDetail(id: number, currentUser: UserJwt) {
    const base = await this.findByBaseId(id);
    // user.roleDiv = user.roleDiv.trim();
    // user.companyId = user.com.trim();

    if (!base) {
      throw new NotFoundException();
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      base.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    return base;
  }
}
