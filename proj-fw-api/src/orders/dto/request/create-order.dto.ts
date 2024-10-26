import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ProductDetailRequestDto {
  @ApiProperty({ description: 'Product detail cd', type: String })
  @IsNotEmpty()
  productDetailCd: string;

  @ApiProperty({ description: 'Quantity orders', type: Number })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
export class CreateOrderDto {
  @ApiProperty({
    description: 'Product details',
    type: ProductDetailRequestDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailRequestDto)
  productDetails: ProductDetailRequestDto[];

  @ApiProperty({ description: 'Supplier cd', type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  supplierCd: string;

  @ApiProperty({ description: 'Item cd', type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  itemCd: string;

  @ApiProperty({
    description: 'Requested deadline',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  requestedDeadline?: Date;

  @ApiProperty({ description: 'Staff id', type: Number, required: false })
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
    description: 'Trading company',
    type: String,
    required: false,
  })
  tradingCompany?: string;

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
  })
  @IsBoolean()
  temporaryFlag: boolean;
}
