import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_ASC,
  DEFAULT_ORDER_DIRECTION_DESC,
} from 'src/constants/common';

export class CommonQueryList {
  @ApiProperty({ description: 'Sort by field', type: String, required: false })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort direction',
    default: DEFAULT_ORDER_DIRECTION_DESC,
    enum: [DEFAULT_ORDER_DIRECTION_ASC, DEFAULT_ORDER_DIRECTION_DESC],
    type: String,
    required: false,
  })
  sortDir?: string;

  @ApiProperty({
    description: 'Records per page',
    default: DEFAULT_LIMIT_FOR_PAGINATION,
    type: Number,
    required: false,
  })
  perPage?: number;

  @ApiProperty({
    description: 'Offset',
    default: DEFAULT_OFFSET,
    type: Number,
    required: false,
  })
  offset?: number;
}
