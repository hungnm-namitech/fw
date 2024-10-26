import {
  HttpStatus,
  Injectable,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
  Logger,
 } from '@nestjs/common';
 import {
  Prisma,
} from '@prisma/client';
import { omit } from 'lodash';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { ProductService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataSuppliersSample } from './suppliers.interface';
import { SUPPLIER_ORDER_BY } from './suppliers.constant';
import { ParentSupplierDto, SupplierItemListDto } from './dto/response/suppliers.dto';
import { SuppliersQueryDto } from './dto/request/suppliers-query.dto';
import { UpdateSupplierDto } from './dto/request/update-supplier.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { SupplierNotFoundException } from 'src/exceptions/supplier-not-found-exception';
import { makeResponse } from 'src/utils';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';

@Injectable()
export class SuppliersService {
  private logger = new Logger(SuppliersService.name);
  constructor(
    private prismaService: PrismaService,
    private itemGroupsService: ProductService,
  ) { }

  async initializeSuppliersData() {
    const dataSupperlier = await this.prismaService.supplier.count();
    if (!dataSupperlier) {
      const supplierSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: 'メーカー',
        columns: [
          {
            nameObj: 'supplierCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'supplierName',
            nameColumn: 'B',
          }
        ],
      };
      const dataSampleSuppliers = readDataFromExcel(supplierSheetConfig);
      const responseAllDataSupplier =
        await this.addSuppliersToDatabase(dataSampleSuppliers);
      return responseAllDataSupplier;
    }
  }

  async addSuppliersToDatabase(suppliers: IDataSuppliersSample[]) {
    const createSupplierQueries = suppliers.map((item) => {
      return this.prismaService.supplier.create({
        data: {
          ...item,
          supplierCd: item.supplierCd.toString(),
        },
      });
    });
    return this.prismaService
      .$transaction(createSupplierQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }

  async checkCompanyInfor(currentUser: UserJwt , companyId?: number) {
    const company = await this.findBySupplierId(String(companyId));
    switch (currentUser.roleDiv) {
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        return Boolean(company);
      default:
        return false;
    }
  }

  findBySupplierId(supplierCd: string) {
    return this.prismaService.supplier.findUnique({
      where: {
        supplierCd,
      },
    });
  }

  getAllSupplier() {
    return this.prismaService.supplier.findMany({
      select: {
        supplierCd: true,
        supplierName: true,
        supplierNameKana: true,
        tel: true,
        postCd: true,
        address1: true,
      },
    });
  }

  async getAllParentSupplier() {
    const selectSql = Prisma.sql`
      SELECT DISTINCT
        p.supplier_cd as supplierCd,
        p.supplier_name as supplierName
    `;
    const InnerJoin = Prisma.sql`
      INNER JOIN suppliers p ON s.parent_supplier_cd = p.supplier_cd
    `;
    const data: ParentSupplierDto[] = (await this.prismaService.$queryRaw`${selectSql}
      FROM suppliers s
      ${InnerJoin}
    `);
    this.logger.log(JSON.stringify(data));

    return data;
  }

  async getListSupplier(searchParams: SuppliersQueryDto, currentUser: UserJwt) {
    if (
      currentUser.roleDiv === USER_ROLE.SUPPLIER
      || currentUser.roleDiv === USER_ROLE.PC
    ) {
      throw new ForbiddenException();
    }

    let where: { [key: string]: any } = {};
    if (searchParams.supplierCd) {
      where.supplierCd = searchParams.supplierCd;
    }
    if (searchParams.supplierName) {
      where.supplierName = {
            contains: searchParams.supplierName,
          };
        // {
        //   supplierNameKana: {
        //     contains: searchParams.supplierName
        //   }
        // },
      // ];
    }
    if (searchParams.tel) {
      where.tel = {
        contains: searchParams.tel,
      };
    }
    if (searchParams.address) {
      where.OR = [
        {
          address1: {
            contains: searchParams.address,
          },
        },
        {
          address2: {
            contains: searchParams.address
          }
        },
        {
          address3: {
            contains: searchParams.address
          }
        },
      ];
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
      if (searchParams.sortBy === SUPPLIER_ORDER_BY.ADDRESS) {
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
        [SUPPLIER_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, suppliers] = await Promise.all([
      this.prismaService.supplier.count({
        where,
      }),
      this.prismaService.supplier.findMany({
        where,
        ...pagination,
      }),
    ]);

    const formattedSuppliers = suppliers.map((supplier) => {
      const omitFields = [
        'createdBy',
        'updatedBy',
      ];
      return {
        ...omit(supplier, omitFields),
        address: `${
          supplier?.address1 ? supplier?.address1 : ''
        }${
          supplier?.address2 ? supplier?.address2 : ''
        }${
          supplier?.address3 ? supplier?.address3 : ''
        }`
      } as SupplierItemListDto;
    });

    return {
      items: formattedSuppliers,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  async getSupplierDetail(id: number, currentUser: UserJwt) {
    const supplier = await this.findBySupplierId(String(id));
    // user.roleDiv = user.roleDiv.trim();
    // user.companyId = user.com.trim();

    if (!supplier) {
      throw new NotFoundException();
    }

    // const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
    //   currentUser,
    //   supplier.companyId,
    // );
    // if (!isValidRoleAndCompanyInfor) {
    //   throw new RoleAndCompanyInforConflictException();
    // }

    return supplier;
  }

  findSupplierById(supplierCd: string) {
    return this.prismaService.supplier.findUnique({
      where: {
        supplierCd,
      },
    });
  }

  async updateSupplier(
    updatingSupplier: UpdateSupplierDto,
    id: number,
    currentUser: UserJwt,
  ) {
    if (
      currentUser.roleDiv === USER_ROLE.SUPPLIER
    ) {
      throw new ForbiddenException();
    }

    const supplier = await this.findSupplierById(String(id));
    if (!supplier) {
      throw new SupplierNotFoundException(HttpStatus.BAD_REQUEST);
    }

    const isValidRoleAndCompanyInfor = await this.checkCompanyInfor(
      currentUser,
      Number(updatingSupplier.supplierCd),
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = ['id', 'createdBy', 'supplierId'];
        const updatedSupplier = await trx.supplier.update({
          where: {
            supplierCd: String(id),
          },
          data: {
            supplierName: updatingSupplier.supplierName,
            supplierNameKana: updatingSupplier.supplierNameKana,
            tel: updatingSupplier.tel,
            postCd: updatingSupplier.postCd,
            address1: updatingSupplier.address1,
            address2: updatingSupplier.address2,
            address3: updatingSupplier.address3,
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
