import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ProductDetailRequestDto } from './create-order.dto';

export class RequestChangeOrderDto {
  @ApiProperty({
    description: 'Item details',
    type: ProductDetailRequestDto,
    required: false,
    isArray: true,
    minLength: 1,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDetailRequestDto)
  productDetails?: ProductDetailRequestDto[];

  @ApiProperty({ description: 'Supplier cd', type: String, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  supplierCd?: string;

  @ApiProperty({ description: 'Item cd', type: String, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  itemCd?: string;

  @ApiProperty({
    description: 'Requested deadline',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  requestedDeadline?: Date;

  @ApiProperty({
    description: 'Company staff id',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  staffId?: number;

  @ApiProperty({
    description: 'Mixed loading flag',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mixedLoadingFlag?: boolean;

  @ApiProperty({
    description: 'Desired vehicle class',
    type: String,
    maxLength: 2,
    required: false,
  })
  @IsOptional()
  @MaxLength(2)
  vehicleClassDiv?: string;

  @ApiProperty({
    description: 'Status div',
    type: String,
    maxLength: 2,
    required: false,
  })
  @IsOptional()
  @MaxLength(2)
  statusDiv?: string;

  @ApiProperty({ description: 'Destination ID', type: Number, required: false })
  @IsOptional()
  @IsInt()
  destinationId?: number;

  @ApiProperty({
    description: 'Memo',
    type: String,
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  memo?: string;

  @ApiProperty({
    description: 'Temporary flag',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  temporaryFlag?: boolean;
}
