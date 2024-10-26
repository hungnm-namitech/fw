import { Injectable } from '@nestjs/common';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataSampleOfProductPrices } from './product-prices.interface';

@Injectable()
export class ProductPriceService {
  constructor(private prismaService: PrismaService) { }

  async initializeProductPricesData() {
    const dataProductGroups = await this.prismaService.productPrice.count();
    if (!dataProductGroups) {
      const itemDetailSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: '製品単価',
        columns: [
          {
            nameObj: 'id',
            nameColumn: 'A',
          },
          {
            nameObj: 'productCd',
            nameColumn: 'B',
          },
          {
            nameObj: 'unitDiv',
            nameColumn: 'C',
          },
          {
            nameObj: 'unitPrice',
            nameColumn: 'D',
          },
          {
            nameObj: 'startDate',
            nameColumn: 'E',
          },
        ],
      };
      const dataSampleItemPrices = readDataFromExcel(itemDetailSheetConfig);
      const responseOfItemPrices =
        await this.addDataSampleItemPrices(dataSampleItemPrices);
      return responseOfItemPrices;
    }
  }

  async addDataSampleItemPrices(
    dataSampleItemPrices: IDataSampleOfProductPrices[],
  ) {
    const createItemPricesQueries = dataSampleItemPrices.map(
      (item: IDataSampleOfProductPrices) => {
        return this.prismaService.productPrice.create({
          data: {
            ...item,
            unitPrice: +item.unitPrice,
            productCd: item.productCd.toString(),
            startDate: new Date(item.startDate),
          },
        });
      },
    );
    return this.prismaService
      .$transaction(createItemPricesQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }
}
