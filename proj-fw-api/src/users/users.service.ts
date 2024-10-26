import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { CompaniesService } from 'src/companies/companies.service';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { RoleAndCompanyInforConflictException } from 'src/exceptions/role-and-company-infor-conflict-exception';
import { UserExistingException } from 'src/exceptions/user-existing.exception';
import { EmailService } from 'src/mailer/email.service';
import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { makeResponse, randomString } from 'src/utils';
import { UsersQueryDto } from './dto/request/users-query.dto';
import { UserItemListDto } from './dto/response/users.dto';
import { USER_ORDER_BY } from './users.constant';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserNotFoundException } from 'src/exceptions/user-not-found-exception';
import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';
import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
import { ResponseException } from 'src/shared/exception/common.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly companiesService: CompaniesService,
    private readonly suppliersService: SuppliersService,
    private readonly emailService: EmailService,
    private readonly passwordCreationMailTemplateStrategy: PasswordCreationMailTemplateStrategy,
    private readonly updateUserMailTemplateStrategy: UpdateUserMailTemplateStrategy,
    private readonly createUserMailTemplateStrategy: CreateUserMailTemplateStrategy,
  ) {}

  async findByUserId(userId: string) {
    return this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });
  }

  async findByMasterUserId(mUserId: number) {
    return this.prismaService.user.findUnique({
      where: {
        mUserId,
      },
    });
  }

  async findByEmailAddress(mailAddress: string) {
    return this.prismaService.user.findFirst({
      where: {
        mailAddress: mailAddress,
      },
    });
  }

  async checkRoleAndCompanyInfor(roleDiv: USER_ROLE, companyId?: string) {
    switch (roleDiv) {
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        return !Boolean(companyId);
      case USER_ROLE.PC:
        if (!companyId) {
          return false;
        }
        const company = await this.companiesService.findCompanyByCd(companyId);
        return Boolean(company);
      case USER_ROLE.SUPPLIER:
        if (!companyId) {
          return false;
        }
        const supplier =
          await this.suppliersService.findBySupplierId(companyId);
        return Boolean(supplier);
    }
  }

  async getListUser(searchParams: UsersQueryDto, currentUser: UserJwt) {
    // User role FW can't get list user role admin
    if (
      currentUser.roleDiv === USER_ROLE.FW &&
      +searchParams.roleDiv === USER_ROLE.ADMIN
    ) {
      throw new ForbiddenException();
    }

    const where: { [key: string]: any } = {};
    if (searchParams.userId) {
      where.userId = {
        contains: searchParams.userId,
      };
    }
    if (searchParams.username) {
      where.username = {
        contains: searchParams.username,
      };
    }
    if (searchParams.mailAddress) {
      where.mailAddress = {
        contains: searchParams.mailAddress,
      };
    }

    if (searchParams.tel) {
      where.tel = {
        contains: searchParams.tel,
      };
    }

    if (searchParams.companyName) {
      where.OR = [
        {
          company: {
            companyName: {
              contains: searchParams.companyName,
            },
          },
        },
        {
          supplier: {
            supplierName: {
              contains: searchParams.companyName,
            },
          },
        },
      ];
    }
    if (searchParams.roleDiv) {
      where.roleDiv = searchParams.roleDiv;
    } else if (currentUser.roleDiv === USER_ROLE.FW) {
      where.roleDiv = {
        in: [
          USER_ROLE.FW.toString(),
          USER_ROLE.PC.toString(),
          USER_ROLE.SUPPLIER.toString(),
        ],
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
      if (searchParams.sortBy !== USER_ORDER_BY.COMPANY_NAME) {
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
        [USER_ORDER_BY.CREATED_AT]: sortDir,
      };
    }

    const [total, users] = await Promise.all([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        where,
        ...pagination,
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
          supplier: {
            select: {
              supplierName: true,
            },
          },
        },
      }),
    ]);

    // Format users response
    const formattedUsers = users.map((user) => {
      const omitFields = [
        'password',
        'company',
        'supplier',
        'createdBy',
        'updatedBy',
        'companyCd',
        'supplierCd',
      ];
      return {
        ...omit(user, omitFields),
        roleDiv: +user.roleDiv,
        companyName: user.company?.companyName,
        supplierName: user.supplier?.supplierName,
      } as UserItemListDto;
    });

    return {
      items: formattedUsers,
      total,
      perPage: pagination.take,
      currentPage:
        +searchParams.offset >= 0
          ? +searchParams.offset + 1
          : DEFAULT_OFFSET + 1,
    };
  }

  async createUser(user: CreateUserDto, currentUser: UserJwt) {
    if (
      user.roleDiv === USER_ROLE.ADMIN &&
      currentUser.roleDiv === USER_ROLE.FW
    ) {
      throw new ForbiddenException();
    }

    const findUserOrCondition: (
      | {
          mailAddress: string;
        }
      | {
          userId: string;
        }
    )[] = [{ userId: user.userId }];

    if (user.mailAddress) {
      findUserOrCondition.push({ mailAddress: user.mailAddress });
    }

    // Check user existing
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        OR: findUserOrCondition,
      },
    });
    if (foundUser) {
      if (user.mailAddress == foundUser.mailAddress) {
        throw new ResponseException(
          HttpStatus.BAD_REQUEST,
          'Mail address already exists',
          [],
          'MAIL_ADDRESS_EXISTS',
        );
      } else {
        throw new ResponseException(
          HttpStatus.BAD_REQUEST,
          'UserId already exists',
          [],
          'USER_ID_EXISTS',
        );
      }
    }

    // Check company existing
    const isValidRoleAndCompanyInfor = await this.checkRoleAndCompanyInfor(
      user.roleDiv,
      user.companyId?.toString(),
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    // Create user and send mail
    const hashedPassword = await this.bcryptService.hashPassword(user.password);
    await this.prismaService.$transaction(
      async (trx) => {
        const createdUser = await trx.user.create({
          data: {
            ...omit(user, ['companyId']),
            usernameKana: user.usernameKana || '',
            password: hashedPassword,
            roleDiv: user.roleDiv.toString(),
            companyCd:
              user.roleDiv === USER_ROLE.PC
                ? user.companyId?.toString()
                : undefined,
            supplierCd:
              user.roleDiv === USER_ROLE.SUPPLIER
                ? user.companyId?.toString()
                : undefined,
            createdBy: currentUser.mUserId,
            mailAddress: user.mailAddress ? user.mailAddress : null,
            updatedBy: currentUser.mUserId,
          },
        });

        if (user.mailAddress) {
          await this.emailService.sendMail(
            this.createUserMailTemplateStrategy.buildTemplate(
              createdUser,
              user.password,
            ),
          );
        }
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async updateUser(
    updatingUser: UpdateUserDto,
    mUserId: number,
    currentUser: UserJwt,
  ) {
    if (
      updatingUser.roleDiv === USER_ROLE.ADMIN &&
      currentUser.roleDiv === USER_ROLE.FW
    ) {
      throw new ForbiddenException();
    }

    const user = await this.findByMasterUserId(mUserId);
    if (!user) {
      throw new UserNotFoundException(HttpStatus.BAD_REQUEST);
    }

    if (updatingUser.mailAddress) {
      const foundUser = await this.findByEmailAddress(updatingUser.mailAddress);
      if (foundUser && foundUser.mUserId !== mUserId) {
        throw new UserExistingException();
      }
    }

    const roleDiv = updatingUser.roleDiv ? updatingUser.roleDiv : +user.roleDiv;
    const companyIdNeedChecking = [USER_ROLE.ADMIN, USER_ROLE.FW].includes(
      roleDiv,
    )
      ? updatingUser.companyId
      : updatingUser.companyId || user.companyCd || user.supplierCd;

    const isValidRoleAndCompanyInfor = await this.checkRoleAndCompanyInfor(
      roleDiv,
      companyIdNeedChecking.toString(),
    );
    if (!isValidRoleAndCompanyInfor) {
      throw new RoleAndCompanyInforConflictException();
    }

    await this.prismaService.$transaction(
      async (trx) => {
        const omitFields = [
          'mUserId',
          'userId',
          'password',
          'createdBy',
          'companyId',
          'supplierId',
        ];
        let companyId = user.companyCd;
        let supplierId = user.supplierCd;
        if ([USER_ROLE.ADMIN, USER_ROLE.FW].includes(roleDiv)) {
          companyId = null;
          supplierId = null;
        }
        if (roleDiv === USER_ROLE.PC) {
          companyId = updatingUser.companyId || companyId || supplierId;
          supplierId = null;
        }
        if (roleDiv === USER_ROLE.SUPPLIER) {
          supplierId = updatingUser.companyId || supplierId || companyId;
          companyId = null;
        }
        const updatedUser = await trx.user.update({
          where: {
            mUserId,
          },
          data: {
            ...omit(updatingUser, omitFields),
            mailAddress:
              updatingUser.mailAddress !== '' ? updatingUser.mailAddress : null,
            roleDiv: roleDiv.toString(),
            companyCd: companyId?.toString(),
            supplierCd: supplierId?.toString(),
            updatedBy: currentUser.mUserId,
          },
        });

        if (updatingUser.mailAddress) {
          await this.emailService.sendMail(
            this.updateUserMailTemplateStrategy.buildTemplate(updatedUser),
          );
        }
      },
      {
        timeout: 10000,
      },
    );

    return makeResponse(HttpStatus.OK);
  }

  async deleteUser(mUserId: number) {
    const user = await this.findByMasterUserId(mUserId);
    if (!user) {
      throw new BadRequestException(
        'The user to be deleted could not be found in the database',
      );
    }
    await this.prismaService.user.delete({
      where: {
        mUserId: mUserId,
      },
    });
    return makeResponse(HttpStatus.OK);
  }

  async passwordCreation(mUserId: number, currentUser: UserJwt) {
    const user = await this.findByMasterUserId(mUserId);
    if (!user) {
      throw new UserNotFoundException(HttpStatus.BAD_REQUEST);
    }

    if (
      +user.roleDiv === USER_ROLE.ADMIN &&
      currentUser.roleDiv !== USER_ROLE.ADMIN
    ) {
      throw new ForbiddenException();
    }

    const newPassword = randomString(10);
    const hashPassword = await this.bcryptService.hashPassword(newPassword);
    await this.prismaService.$transaction(async (trx) => {
      await trx.user.update({
        where: {
          mUserId,
        },
        data: {
          password: hashPassword,
        },
      });

      await this.emailService.sendMail(
        this.passwordCreationMailTemplateStrategy.buildTemplate(
          user,
          newPassword,
        ),
      );
    });

    return makeResponse(HttpStatus.OK);
  }

  async getUserDetail(id: number, requestUserRole: number) {
    const user = await this.findByMasterUserId(id);
    user.roleDiv = user.roleDiv.trim();

    if (!user) {
      throw new NotFoundException();
    }

    if (this.isViolateRoleScope(requestUserRole, +user.roleDiv)) {
      throw new ForbiddenException();
    }

    const data = {
      ...user,
      companyId: user.companyCd,
      supplierId: user.supplierCd,
      companyCd: undefined,
      supplierCd: undefined,
    };

    return data;
  }

  isViolateRoleScope(authUserRole: number, targetUserRole: number) {
    if (authUserRole === USER_ROLE.FW && targetUserRole === USER_ROLE.ADMIN) {
      return true;
    }

    return false;
  }
}
