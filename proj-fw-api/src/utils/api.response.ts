import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as statuses from 'statuses';

export function makeResponse(status: HttpStatus) {
  return {
    message: statuses(status) || String(status),
    status,
  };
}

export class CommonListResponse<T> {
  items: T[];

  @ApiProperty({ description: 'Current page', type: Number })
  currentPage: number;

  @ApiProperty({ description: 'Number record in one page', type: Number })
  perPage: number;

  @ApiProperty({ description: 'Total record', type: Number })
  total: number;
}
