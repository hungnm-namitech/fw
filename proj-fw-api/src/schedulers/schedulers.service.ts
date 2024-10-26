import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isNotEmptyObject } from 'class-validator';
import { omit } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { makeResponse } from 'src/utils';
import { TypeColumnData } from 'src/utils/read-file.xlsx';
import {
  BULK_INSERT_FOLDERS,
  FOREIGN_KEY_CONFIG,
  REFERENCES_CONFIG,
  REFERENCE_TYPE,
  RELATIONS_CONFIG,
  RELATION_TYPE,
  SHEET_CONFIG,
} from './schedulers.constant';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulersService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StorageService,
  ) {}
  private logger = new Logger(SchedulersService.name);
  @Cron('0 0 0 * * *', {
    timeZone: 'Asia/Tokyo',
    name: 'BulkInsertData',
  })
  async bulkInsertItems() {
    this.logger.log('bulkInsertItems start');
    const contents = await this.storageService.getAllObjectsFromBucket(
      BULK_INSERT_FOLDERS.processing,
    );
    if (!contents) {
      this.logger.log('bulkInsertItems end no file.');
      return makeResponse(HttpStatus.OK);
    }
    const keys = contents
      .map((content) => content.Key)
      .filter((key) => key.includes('.xlsx'))
      .sort((a: string, b: string) => {
        const t1 = Number(a.split('_').pop().split('.xlsx')[0]);
        const t2 = Number(b.split('_').pop().split('.xlsx')[0]);
        return t1 - t2;
      });
    for (const key of keys) {
      await this.createItemFromFileExcel(key).catch((err) =>
        console.log(`Processing file ${key} error: `, err),
      );
    }
    this.logger.log('bulkInsertItems end');
    return makeResponse(HttpStatus.OK);
  }

  async createItemFromFileExcel(key: string) {
    const fileName = key
      .split(BULK_INSERT_FOLDERS.processing + '/')[1]
      .split('.xlsx')[0];
    const logFileName = `${BULK_INSERT_FOLDERS.log}/${fileName} のエラーログ.csv`;
    const failureDestination = `${BULK_INSERT_FOLDERS.errorFiles}/${fileName}.csv`;
    const completedDestination = `${BULK_INSERT_FOLDERS.completed}/${fileName}.csv`;
    const file = await this.storageService.getExcelFile(key, SHEET_CONFIG);
    const invalidData = {};
    for (let index = 0; index < SHEET_CONFIG.length; index++) {
      const config = SHEET_CONFIG[index];
      const invalid = await this.validateSheetData({
        tableName: config.table,
        relations: RELATIONS_CONFIG[config.table] || [],
        primaryKey: config.primaryKey,
        data: file[config.table],
        references: REFERENCES_CONFIG[config.table].map((config) => ({
          ...config,
          data: file[config.sheet],
        })),
        foreignKeyConstraint: FOREIGN_KEY_CONFIG[config.table].map(
          (config) => ({
            ...config,
            data: file[config.sheet],
          }),
        ),
      });
      if (invalid) {
        invalidData[config.table] = invalid;
      }
    }
    if (isNotEmptyObject(invalidData)) {
      // Create file log and upload to S3
      const csvString = this.generateCsvErrorData(invalidData);
      await this.storageService.createAndUploadFileCsvToS3(
        csvString,
        logFileName,
        `${fileName}.csv`,
      );
      // Remove file xlsx to folder failure
      await this.storageService.moveFileInS3(key, failureDestination);
      return invalidData;
    }
    await this.prismaService
      .$transaction(
        async (trx) => {
          for (let index = 0; index < SHEET_CONFIG.length; index++) {
            const config = SHEET_CONFIG[index];
            await this.updateSheetData(
              config.table,
              config.primaryKey,
              file[config.table],
              trx,
            );
          }
          // Remove file xlsx to folder completed
          await this.storageService.moveFileInS3(key, completedDestination);
        },
        { timeout: 60000 },
      )
      .catch(async (err) => {
        const errorMessage =
          err?.message || 'Fail when upsert database or move file S3';
        await this.storageService.createAndUploadFileCsvToS3(
          errorMessage,
          logFileName,
          `${fileName}.csv`,
        );
        // Remove file xlsx to folder failure
        await this.storageService.moveFileInS3(key, failureDestination);
      });
    return null;
  }

  async validateSheetData({
    tableName,
    references = [],
    relations = [],
    foreignKeyConstraint = [],
    primaryKey,
    data,
  }: {
    tableName: string;
    primaryKey: string;
    references: REFERENCE_TYPE[];
    foreignKeyConstraint: REFERENCE_TYPE[];
    relations: RELATION_TYPE[];
    data: { [key: string]: any }[];
  }) {
    // Get invalid data
    const invalidData = data.reduce((acc, row) => {
      Object.values(row).forEach((col: { [key: string]: any }) => {
        if (!col.isValid) {
          acc[col.cell] = col.errorMessage;
        }
      });
      return acc;
    }, {});

    // Checking deleting data in current database
    const deletingPrimaryKey = data.reduce((acc, row) => {
      const id = row[primaryKey];
      const deleteFlag = row.deleteFlag;
      if (id?.isValid && deleteFlag?.value) {
        acc[id.value] = id;
      }
      return acc;
    }, {});

    const deletingData = await this.prismaService[tableName].findMany({
      where: {
        [primaryKey]: {
          in: Object.values(deletingPrimaryKey).map((item) => item.value),
        },
      },
      select: {
        [primaryKey]: true,
        ...relations.reduce((acc, relation) => {
          acc[relation.table] = true;
          return acc;
        }, {}),
      },
    });

    deletingData.forEach((item) => {
      const canDeletingItem = relations.every(
        (relation) => !item[relation.table]?.length,
      );
      const id = item[primaryKey];
      if (!canDeletingItem) {
        deletingPrimaryKey[id] = {
          ...deletingPrimaryKey[id],
          notDeletingReason: `This record cannot be deleted because it is linked to another table`,
        };
      } else {
        deletingPrimaryKey[id] = {
          ...deletingPrimaryKey[id],
          canDeletingItem: true,
        };
      }
    });

    // Update deleting invalid data
    Object.values(deletingPrimaryKey).forEach((itemData: any) => {
      let errorMessage =
        itemData.notDeletingReason ||
        `This record does not exist so it cannot be deleted`;
      if (itemData.canDeletingItem) {
        const itemValue = itemData.value;
        // Checking current data relation to other sheet
        const relationToRowDeletingInOtherSheet = references
          .filter((reference) => {
            return reference.data.find(
              (item) =>
                item[reference.referenceKey]?.value === itemValue &&
                item.deleteFlag?.value !== true,
            );
          })
          .map((reference) => this.getSheetName(reference.sheet));
        if (!relationToRowDeletingInOtherSheet.length) {
          return;
        }
        errorMessage = `Cannot delete record because record are linked to records in sheets: ${relationToRowDeletingInOtherSheet.join(
          ',',
        )}`;
      }

      if (!invalidData[itemData.cell]) {
        invalidData[itemData.cell] = errorMessage;
      } else {
        invalidData[itemData.cell] += `, ${errorMessage}`;
      }
    });

    // Checking upsert data
    const updatingPrimaryKey: {
      [key: string | number]: { [key: string]: TypeColumnData };
    } = data.reduce((acc, row) => {
      const id = row[primaryKey];
      const deleteFlag = row.deleteFlag;
      const allColValid = Object.values(row).every((col) => col?.isValid);
      if (id?.isValid && !deleteFlag?.value && allColValid) {
        acc[id.value] = row;
      }
      return acc;
    }, {});

    const referenceData = await Promise.all(
      foreignKeyConstraint.map(async (config) => {
        const keyValues = new Set();
        Object.values(updatingPrimaryKey).forEach((row) => {
          keyValues.add(row[config.referenceKey]?.value);
        });
        const data = await this.prismaService[config.sheet].findMany({
          where: {
            [config.referenceKey]: {
              in: Array.from(keyValues),
            },
          },
        });
        const foreignKeyDataInOtherSheet = config.data.reduce(
          (acc, row) => {
            const item = row[config.referenceKey];
            if (keyValues.has(item?.value)) {
              acc[item.value] = true;
            }
            return acc;
          },
          {} as { [key: string]: boolean },
        );
        const formattedData = data.reduce((acc, item) => {
          acc[item[config.referenceKey]] = true;
          return acc;
        }, {});
        return {
          [config.referenceKey]: {
            ...formattedData,
            ...foreignKeyDataInOtherSheet,
          },
        };
      }),
    ).then(
      (
        sheetReferenceData: {
          [key: string]: { [key: string | number]: boolean };
        }[],
      ) =>
        sheetReferenceData.reduce((acc, sheet) => {
          return { ...acc, ...sheet };
        }, {}),
    );

    // Update upserting invalid data
    Object.values(updatingPrimaryKey).forEach(
      (itemData: { [key: string]: TypeColumnData }) => {
        Object.keys(itemData).forEach((key) => {
          const col = itemData[key];
          if (!referenceData[key] || referenceData[key][col.value]) return;
          const errorMessage = `${col.cell} (${col.nameObj}) does not have a corresponding record in the database or in another sheet.`;
          if (!invalidData[col.cell]) {
            invalidData[col.cell] = errorMessage;
          } else {
            invalidData[col.cell] += `, ${errorMessage}`;
          }
        });
      },
    );

    return Object.values(invalidData).every((data) => !data)
      ? null
      : invalidData;
  }

  async updateSheetData(
    table: string,
    primaryKey: string,
    data: { [key: string]: any }[],
    trx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const { deletingData, upsertingData } = data.reduce(
      (acc, item) => {
        if (item.deleteFlag?.value) {
          acc.deletingData.push(item);
        } else {
          acc.upsertingData.push(item);
        }
        return acc;
      },
      {
        deletingData: [],
        upsertingData: [],
      },
    );

    if (deletingData.length) {
      await trx[table].deleteMany({
        where: {
          [primaryKey]: {
            in: deletingData.map((item) => item[primaryKey].value),
          },
        },
      });
    }
    if (upsertingData.length) {
      await Promise.all(
        upsertingData.map(async (row) => {
          const upsertData = Object.keys(row).reduce((acc, key) => {
            acc[key] = row[key].value;
            return acc;
          }, {});
          return trx[table]
            .upsert({
              where: {
                [primaryKey]: upsertData[primaryKey],
              },
              create: omit(upsertData, ['deleteFlag']),
              update: omit(upsertData, [primaryKey, 'deleteFlag']),
            })
            .catch((err) => {
              console.log(err, upsertData, primaryKey, table);
              throw err;
            });
        }),
      );
    }
  }

  getSheetName(table: string) {
    const sheet = SHEET_CONFIG.find((config) => config.table === table);
    return sheet?.sheetName;
  }

  generateCsvErrorData(invalidData: {
    [key: string]: { [key: string]: string };
  }): string {
    let str = '';
    Object.keys(invalidData).forEach((tableName) => {
      const sheetName = this.getSheetName(tableName);
      const sheetData = invalidData[tableName] || {};
      Object.keys(sheetData).forEach((key: string) => {
        if (sheetData[key]) {
          str += `(${sheetName}) Cell ${key}: ${sheetData[key]} \n`;
        }
      });
    });
    return str;
  }
}
