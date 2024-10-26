import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateSupplierDto {
  @ApiProperty({ description: 'Supplier id', type: Number })
  supplierCd: number;

  @ApiProperty({ description: 'Supplier name', type: String })
  @MaxLength(128)
  supplierName: string;

  @ApiProperty({ description: 'Supplier name kana', type: String })
  @MaxLength(128)
  supplierNameKana: string;

  @ApiProperty({ description: 'tel', type: String })
  @MaxLength(13)
  tel: string;

  @ApiProperty({ description: 'Post code', type: String })
  @MaxLength(7)
  postCd: string;

  @ApiProperty({ description: 'address1', type: String })
  @MaxLength(256)
  address1: string;

  @ApiProperty({ description: 'address2', type: String })
  @MaxLength(256)
  address2: string;

  @ApiProperty({ description: 'address3', type: String })
  @MaxLength(256)
  address3: string;
}