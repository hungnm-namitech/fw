import { Injectable } from '@nestjs/common';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataSampleOfItem } from './item.interface';

@Injectable()
export class ItemService {
    constructor(private readonly prismaService: PrismaService) {

    }

    async initializeItemData() {
        const isItem = await this.prismaService.item.count()
        if (!isItem) {
            const itemSheetConfig = {
                filePath: SRC_DATA_SAMPLE,
                sheetName: 'アイテム',
                columns: [
                    {
                        nameObj: 'itemCd',
                        nameColumn: 'A',
                    },
                    {
                        nameObj: 'itemName',
                        nameColumn: 'B',
                    },
                    {
                        nameObj: 'iconFileName',
                        nameColumn: 'C',
                    },
                    {
                        nameObj: 'displayDiv',
                        nameColumn: 'D',
                    },
                ]
            }
            const dataSampleItem = readDataFromExcel(itemSheetConfig);
            const responseAllDataItem = await this.addDataSampleToDatabase(dataSampleItem)
            return responseAllDataItem;
        }
    }


    async addDataSampleToDatabase(dataSample: IDataSampleOfItem[]) {
        const createItemQuery = dataSample.map((item: IDataSampleOfItem) => {
            return this.prismaService.item.create(({
                data: {
                    ...item,
                    itemCd: item.itemCd.toString(),
                    displayDiv: item.displayDiv
                }
            }))
        })

        return this.prismaService
            .$transaction(createItemQuery)
            .catch((error) => {
                console.error('Something error:', error);
                throw error;
            });
    }
}
