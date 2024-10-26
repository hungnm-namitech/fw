import { Injectable } from '@nestjs/common';
import { SRC_DATA_CODE, SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';

@Injectable()
export class DivValuesService {
  constructor(private prismaService: PrismaService) { }
  getDivValuesByDivCd(divCd: string) {
    return this.prismaService.divValues.findMany({
      where: {
        divCd,
      },
      select: {
        divValue: true,
        divValueName: true,
      },
    });
  }

  async initializeDivValueData() {
    const isDivValue = await this.prismaService.divValues.count();
    if (!isDivValue) {
      const divValueSheetConfig = {
        filePath: SRC_DATA_CODE,
        sheetName: '区分値マスタ',
        columns: [
          {
            nameObj: 'divCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'divValue',
            nameColumn: 'B',
          },
          {
            nameObj: 'divValueName',
            nameColumn: 'C',
          },
        ],
      };
      const dataCodeDivValue = readDataFromExcel(divValueSheetConfig);
      const responseAllDataCompanies = await this.addDivValueToDb(dataCodeDivValue);
      return responseAllDataCompanies;
    }

  }

  async addDivValueToDb(divValue: any[]) {
    const createCompanyQueries = divValue.map((item) => {
      return this.prismaService.divValues.create({
        data: {
          ...item,
          divValue: item.divValue.toString()
        }
      });
    });
    return this.prismaService
      .$transaction(createCompanyQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }
}
