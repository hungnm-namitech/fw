import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ISeederDataUser,
  ISeederItemGroup,
  ISeederOrderDetail,
} from './seeder.interface';
import { ResponseException } from 'src/shared/exception/common.exception';

@Injectable()
export class SeederService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async createSeeder(data: ISeederDataUser) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        userId: data.userId,
      },
    });
    if (existingUser) {
      throw new ResponseException(HttpStatus.BAD_REQUEST, 'User id is exist');
    }
    const companyCd = (await this.prismaService.company.findFirst()).companyCd
    const supplierCd = (await this.prismaService.supplier.findFirst()).supplierCd
    await this.prismaService.user.create({
      data: {
        ...data,
        companyCd,
        supplierCd
      },
    });
    return 'create seeder successfully';
  }

  async createOrderHeader() {
    const itemCd = (await this.prismaService.item.findFirst()).itemCd
    const supplierCd = (await this.prismaService.supplier.findFirst()).supplierCd
    const companyCd = (await this.prismaService.company.findFirst()).companyCd
    const data = this.prismaService.orderHeader.create({
      data: {
        itemCd,
        supplierCd,
        companyCd,
        statusDiv: "3",
        orderQuantity: 100000
      }
    });
    return data
  }

  async createOrderDetail() {
    const productDetailCd = (await this.prismaService.productDetail.findFirst()).productDetailCd;
    const orderHeaderId = (await this.createOrderHeader()).id;
    const createOrderDetail = await this.prismaService.orderDetail.create({
      data: {
        orderHeaderId,
        productDetailCd,
        quantity: 10
      }
    })
    if (!createOrderDetail) {
      return "Something is wrong"
    }
    return 'create order detail successfully';
  }

  createBase(data) {
    return this.prismaService.base.create({ data });
  }

}
