import { Injectable } from '@nestjs/common';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataOfCommercialFlows } from './commercial-flows.interface';

@Injectable()
export class CommercialFlowsService {
  constructor(private prismaService: PrismaService) { }

  async initializeSuppliersData(
  ) {
    const dataSupperlier = await this.prismaService.commercialFlow.count();
    if (!dataSupperlier) {
      const comemercialFlowsSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: 'アイテム・プレカット',
        columns: [
          {
            nameObj: 'commercialFlowCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'itemCd',
            nameColumn: 'B',
          },
          {
            nameObj: 'supplierCd',
            nameColumn: 'C',
          },
          {
            nameObj: 'companyCd',
            nameColumn: 'D',
          },
          {
            nameObj: 'monthlyForecast',
            nameColumn: 'E',
          },
          {
            nameObj: 'tradingCompany1',
            nameColumn: 'F',
          },
          {
            nameObj: 'tradingCompany2',
            nameColumn: 'G',
          },
          {
            nameObj: 'tradingCompany3',
            nameColumn: 'H',
          },
          {
            nameObj: 'tradingCompany4',
            nameColumn: 'I',
          },
        ],
      };
      const dataSampleCommercialFlows = readDataFromExcel(
        comemercialFlowsSheetConfig,
      );
      const changeTypeOfDataCommercialFlow = dataSampleCommercialFlows.map(
        (item) => ({
          ...item,
          commercialFlowCd: item.commercialFlowCd.toString(),
          companyCd: item.companyCd.toString(),
          itemCd: item.itemCd.toString(),
          supplierCd: item.supplierCd.toString(),
          tradingCompany1: item.tradingCompany1,
          tradingCompany2: item.tradingCompany2,
          tradingCompany3: item.tradingCompany3,
          tradingCompany4: item.tradingCompany4,
        }),
      );
      const responseAllDataCommercialFlows = this.addCompaniesToDatabase(
        changeTypeOfDataCommercialFlow
      );
      return responseAllDataCommercialFlows;
    }
  }

  async addCompaniesToDatabase(
    commercialFlows: IDataOfCommercialFlows[],
  ) {
    const createCompanyQueries = commercialFlows.map((item) => {
      return this.prismaService.commercialFlow.create({
        data: item
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
