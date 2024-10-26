import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsOutput,
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as XLSX from 'xlsx';
import { SHEET_CONFIG_TYPE } from './storage.constant';
import { getSheetData } from 'src/utils/read-file.xlsx';
import { writeFile, unlink } from 'node:fs/promises';
import * as fs from 'fs';
@Injectable()
export class StorageService {
  private readonly s3 = new S3Client({
    region: this.configService.get('AWS_DEFAULT_REGION'),
  });
  private readonly bucket = this.configService.get('S3_BUCKET_NAME');

  constructor(private configService: ConfigService) {}

  async createStreamFile(key: string): Promise<Readable> {
    const params = {
      Bucket: this.bucket, // replace with your bucket name
      Key: key, // replace with your file key
    };

    const command = new GetObjectCommand(params);

    const response = await this.s3.send(command);
    return response.Body as Readable;
  }

  async getExcelFile(
    key: string,
    sheetConfig: SHEET_CONFIG_TYPE[],
  ): Promise<{ [key: string]: any[] }> {
    const dataStream = await this.createStreamFile(key);
    return this.readFileExcel(dataStream, sheetConfig);
  }

  async getAllObjectsFromBucket(
    prefix: string,
  ): Promise<ListObjectsOutput['Contents']> {
    const command = new ListObjectsCommand({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    const response = await this.s3.send(command);
    return response.Contents;
  }

  readFileExcel(
    stream: Readable,
    sheetConfig: SHEET_CONFIG_TYPE[],
  ): Promise<{ [key: string]: any[] }> {
    return new Promise((resolve, reject) => {
      const buffers = [];

      stream.on('data', function (data) {
        buffers.push(data);
      });

      stream.on('end', function () {
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
        const results: { [key: string]: any[] } = {};
        sheetConfig.forEach((config) => {
          const workSheetName = workbook.SheetNames[config.sheet];
          const worksheet = workbook.Sheets[workSheetName];
          results[config.table] = getSheetData(
            worksheet,
            config.fieldConfig,
            config.primaryKey,
          );
        });
        resolve(results);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async moveFileInS3(copySource: string, destinationKey: string) {
    try {
      await this.s3.send(
        new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `/${this.bucket}/${copySource}`,
          Key: destinationKey,
        }),
      );
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: copySource,
        }),
      );
    } catch (err) {
      console.error('Error moving file', err);
    }
  }

  async createAndUploadFileCsvToS3(
    csvString: string,
    destinationKey: string,
    fileName: string,
  ) {
    try {
      await writeFile(fileName, csvString, 'utf-8');
      const body = fs.createReadStream(fileName);

      const params = {
        Bucket: this.bucket,
        Key: destinationKey,
        Body: body,
      };
      await this.s3.send(new PutObjectCommand(params));
      await unlink(fileName);
    } catch (error) {
      console.log(error);
    }
  }
}
