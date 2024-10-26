import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import {
  MIXED_LOADING_FLAG,
  ORDER_HEADER_ORDER_BY,
} from 'src/orders/orders.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class SearchOrderParams extends CommonQueryList {
  @ApiProperty({
    description: 'Order header id',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiProperty({
    description: 'List order status',
    type: String,
    required: false,
    example: '1,2,3',
  })
  @IsOptional()
  statuses?: string;

  @ApiProperty({
    description: 'Order header reply deadline from',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  replyDeadlineFrom?: Date;

  @ApiProperty({
    description: 'Order header reply deadline to',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  replyDeadlineTo?: Date;

  @ApiProperty({
    description: 'Order header mixed loading flag',
    type: String,
    enum: MIXED_LOADING_FLAG,
    required: false,
  })
  @IsOptional()
  @IsEnum(MIXED_LOADING_FLAG)
  @Type(() => Number)
  mixedLoadingFlag?: string;

  @ApiProperty({
    description: 'Order header memo',
    type: String,
    required: false,
  })
  @IsOptional()
  memo?: string;

  @ApiProperty({
    description: 'Order group ids',
    type: String,
    required: false,
    example: '1,2,3',
  })
  @IsOptional()
  itemCds?: string;

  @ApiProperty({
    description: 'Order customer ids',
    type: String,
    required: false,
    example: '1,2,3',
  })
  @IsOptional()
  companyCds?: string;

  @ApiProperty({
    description: 'Order header created at from',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdAtFrom?: Date;

  @ApiProperty({
    description: 'Order header created at to',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdAtTo?: Date;

  @ApiProperty({
    description: 'Order header updated at from',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedAtFrom?: Date;

  @ApiProperty({
    description: 'Order header updated at to',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedAtTo?: Date;

  @ApiProperty({
    description: 'Order header requested deadline from',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  requestedDeadlineFrom?: Date;

  @ApiProperty({
    description: 'Order header requested deadline to',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  requestedDeadlineTo?: Date;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: ORDER_HEADER_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(ORDER_HEADER_ORDER_BY)
  sortBy?: ORDER_HEADER_ORDER_BY;
}
