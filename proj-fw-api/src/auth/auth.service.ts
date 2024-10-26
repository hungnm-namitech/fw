import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { EmailNotExistException } from 'src/exceptions/email-not-exist.exception';
import { EmailService } from 'src/mailer/email.service';
import { ResetPasswordMailTemplateStrategy } from 'src/mailer/template/reset-password';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt/bcrypt.service';
import { ResponseException } from 'src/shared/exception/common.exception';
import { UsersService } from 'src/users/users.service';
import { makeResponse, randomString } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private emailService: EmailService,
    private prismaService: PrismaService,
    private resetPasswordMailTemplateStrategy: ResetPasswordMailTemplateStrategy,
  ) { }

  async signIn(user: User): Promise<{
    access_token: string;
    roleDiv: number;
    username: string;
    userId: string;
    sub: number;
    companyCd?: string;
    supplierCd?: string;
  }> {
    const payload = {
      sub: user.mUserId,
      userId: user.userId,
      username: user.username,
      roleDiv: +user.roleDiv,
      companyCd: user.companyCd,
      supplierCd: user.supplierCd,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      ...payload,
    };
  }

  async validateUser(userId: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new ResponseException(
        HttpStatus.UNAUTHORIZED,
        'Incorrect credentials',
      );
    }
    const isPasswordCorrect = await this.bcryptService.comparePassword(
      pass,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ResponseException(
        HttpStatus.UNAUTHORIZED,
        'Incorrect credentials',
      );
    }
    const { password, ...result } = user;
    return result;
  }

  async resetPassword(mailAddress: string) {
    const user = await this.usersService.findByEmailAddress(mailAddress);
    if (!user) {
      throw new EmailNotExistException();
    }
    const newPassword = randomString(10);
    const hashedPassword = await this.bcryptService.hashPassword(newPassword);
    const mailContent = this.resetPasswordMailTemplateStrategy.buildTemplate(
      user,
      newPassword,
    );
    this.prismaService.$transaction(
      async (trx) => {
        const updatedUser = await trx.user.update({
          where: {
            mUserId: user.mUserId,
          },
          data: {
            password: hashedPassword,
          },
        });
        await this.emailService.sendMail(mailContent);
        return updatedUser;
      },
      { timeout: 10000 },
    );
    return makeResponse(HttpStatus.OK);
  }

  async getMe(mUserId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          mUserId
        },
        select: {
          mUserId: true,
          userId: true,
          username: true,
          usernameKana: true,
          mailAddress: true,
          tel: true,
          roleDiv: true,
          companyCd: true,
          supplierCd: true
        }
      })
      const supplier = await this.prismaService.supplier.findFirst({
        where: {
          supplierCd: user?.supplierCd || ''
        }
      })
      return {...user, supplierName: supplier?.supplierName || ''}
    } catch (error) {
      console.log(error);
    }
  }
}
