import { BadRequestException, Injectable } from '@nestjs/common';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataSampleOfProductDetail } from './product-details.interface';

@Injectable()
export class ProductDetailService {
  constructor(private prismaService: PrismaService) {}

  async initializeProductDetailData() {
    const dataProductDetailGroups =
      await this.prismaService.productDetail.count();
    if (!dataProductDetailGroups) {
      const itemDetailSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: '製品詳細',
        columns: [
          {
            nameObj: 'productDetailCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'productCd',
            nameColumn: 'B',
          },
          {
            nameObj: 'width',
            nameColumn: 'C',
          },
          {
            nameObj: 'thickness',
            nameColumn: 'D',
          },
          {
            nameObj: 'length',
            nameColumn: 'E',
          },
          {
            nameObj: 'quantityPerPack',
            nameColumn: 'F',
          },
        ],
      };
      const dataSampleProductDetail = readDataFromExcel(itemDetailSheetConfig);
      const responseOfProductDetail = await this.addProductDetailSampleData(
        dataSampleProductDetail,
      );
      return responseOfProductDetail;
    }
  }

  async addProductDetailSampleData(
    dataProductDetail: IDataSampleOfProductDetail[],
  ) {
    const createProductDetailQueries = dataProductDetail.map(
      (item: IDataSampleOfProductDetail) => {
        return this.prismaService.productDetail.create({
          data: {
            ...item,
            productDetailCd: item.productDetailCd.toString(),
            length: item.length.toString(),
            productCd: item.productCd.toString(),
          },
        });
      },
    );
    return this.prismaService
      .$transaction(createProductDetailQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }

  findProductDetailByCd(productDetailCd: string) {
    return this.prismaService.productDetail.findUnique({
      where: {
        productDetailCd,
      },
    });
  }

  async getListProductDetailByCds(productDetailCds: string[]) {
    const itemDetailIds = new Set(productDetailCds);
    if (itemDetailIds.size !== productDetailCds.length) {
      throw new BadRequestException(`Item detail lists cannot be duplicated`);
    }
    const itemDetails = await this.prismaService.productDetail.findMany({
      where: {
        productDetailCd: {
          in: productDetailCds,
        },
      },
      include: {
        product: true,
      },
    });
    return itemDetails;
  }
}
