import {
  HttpStatus,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataCompaniesSample } from './companies.interface';
import { CompaniesQueryDto } from './dto/request/companies-query.dto';
import { CompanyItemListDto } from './dto/response/companies.dto';
import { COMPANY_ORDER_BY } from './companies.constant';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { CompanyNotFoundException } from 'src/exceptions/company-not-found-exception';
import { makeResponse } from 'src/utils';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';

@Injectable()
export class CompaniesService {
  constructor(private prismaService: PrismaService) {}

  async findByCompanyCd(companyCd: string) {
    return this.prismaService.company.findFirst({
      where: {
        companyCd,
      },
    });
  }

  async checkCompanyInfor(currentUser: UserJwt, companyCd?: string) {
    const company = await this.findCompanyByCd(companyCd);
    switch (currentUser.roleDiv) {
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        return Boolean(company);
      default:
        return false;
    }
  }
  // TODO: 暫定実装
  async initializeCompaniesData() {
    const isCompanies = await this.prismaService.company.count();
    if (!isCompanies) {
      const companiesSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: 'プレカット工場',
        columns: [
          {
            nameObj: 'companyCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'companyName',
            nameColumn: 'B',
          },
        ],
      };

      const dataSampleCompanies = readDataFromExcel(companiesSheetConfig);
      const responseAllDataCompanies =
        await this.addCompaniesToDatabase(dataSampleCompanies);
      return responseAllDataCompanies;
    }
  }

  getAllCompany(currentUser: UserJwt) {
    const where: { [key: string]: any } = {};
    if (currentUser.roleDiv === USER_ROLE.PC) {
      where.companyCd = currentUser.companyCd;
    } else if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      where.commercialFlows = {
        some: {
          supplierCd: currentUser.supplierCd,
        },
      };
    }
    return this.prismaService.company.findMany({
      select: {
        companyCd: true,
        companyName: true,
      },
      where,
    });
  }

  async getListCompany(searchParams: CompaniesQueryDto, currentUser: UserJwt) {
    if (
      currentUser.roleDiv === USER_ROLE.SUPPLIER ||
      currentUser.roleDiv === USER_ROLE.PC
    ) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (searchParams.companyCd) {
      where.companyCd = searchParams.companyCd;
    }
    if (searchParams.companyName) {
      where.companyName = {
        contains: searchParams.companyName,
      };
    }
    if (searchParams.tel) {
      where.tel = {
        contains: searchParams.tel,
      };
    }
    if (searchParams.address) {
      where.address = {
        contains: searchParams.address,
      };
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
      if (searchParams.sortBy === COMPANY_ORDER_BY.ADDRESS) {
        pagination.orderBy = {
          ['address1']: sortDir,
        };
      } else {
        pagination.orderBy = {
          [searchParams.sortBy]: sortDir,
        };  
      }
    } else {
      pagination.orderBy = {
        [COMPANY_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, companies] = await Promise.all([
      this.prismaService.company.count({
        where,
      }),
      this.prismaService.company.findMany({
        where,
        ...pagination,
      }),
    ]);

    const formattedCompanies = companies.map((company) => {
      const omitFields = ['company', 'createdBy', 'updatedBy', 'companyId'];
      return {
        ...omit(company, omitFields),
        address: `${
          company?.address1 ? company?.address1 : ''
        }${
          company?.address2 ? company?.address2 : ''
        }${
          company?.address3 ? company?.address3 : ''
        }`,
      } as CompanyItemListDto;
    });

    return {
      items: formattedCompanies,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  async getCompanyDetail(id: string, currentUser: UserJwt) {
    const company = await this.findByCompanyCd(id);

    if (!company) {
      throw new NotFoundException();
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      company.companyCd,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    return company;
  }

  async addCompaniesToDatabase(companies: IDataCompaniesSample[]) {
    const createCompanyQueries = companies.map((item) => {
      return this.prismaService.company.create({
        data: {
          ...item,
          companyCd: item.companyCd.toString(),
          companyName: item.companyName.toString(),
        },
      });
    });
    return this.prismaService
      .$transaction(createCompanyQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }

  findCompanyByCd(companyCd: string) {
    return this.prismaService.company.findUnique({
      where: {
        companyCd: companyCd.toString(),
      },
    });
  }

  getAllStaffOfCompany(companyCd: string) {
    return this.prismaService.staff.findMany({
      where: {
        companyCd,
      },
      select: {
        id: true,
        staffName: true,
      },
    });
  }

  getAllBaseOfCompany(companyCd: string) {
    return this.prismaService.base.findMany({
      where: {
        companyCd,
      },
      select: {
        id: true,
        baseName: true,
        telNumber: true,
        address1: true,
      },
    });
  }

  findBaseById(baseId: number) {
    return this.prismaService.base.findUnique({
      where: {
        id: baseId,
      },
    });
  }

  async updateCompany(
    updatingCompany: UpdateCompanyDto,
    id: string,
    currentUser: UserJwt,
  ) {
    if (currentUser.roleDiv === USER_ROLE.SUPPLIER) {
      throw new ForbiddenException();
    }

    const company = await this.findCompanyByCd(id);
    if (!company) {
      throw new CompanyNotFoundException(HttpStatus.BAD_REQUEST);
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      updatingCompany.id,
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = ['id', 'createdBy', 'companyId'];
        const companyCd = company.companyCd;
        const updatedCompany = await trx.company.update({
          where: {
            companyCd,
          },
          data: {
            companyName: updatingCompany.companyName,
            companyNameKana: updatingCompany.companyNameKana,
            tel: updatingCompany.tel,
            postCd: updatingCompany.postCd,
            address1: updatingCompany.address1,
            address2: updatingCompany.address2,
            address3: updatingCompany.address3,
          },
        });
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }
}
