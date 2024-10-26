import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class OrderItemListDto {
  @ApiProperty({ description: 'Order id', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name', type: String })
  itemName: string;

  @ApiProperty({ description: 'Order status', type: String })
  statusDiv: string;

  @ApiProperty({ description: 'Order created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Order updated at', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: 'Order order quantity', type: Number })
  orderQuantity: number;

  @ApiProperty({
    description: 'Trading company',
    type: String,
    required: false,
  })
  tradingCompany?: string;

  @ApiProperty({
    description: 'SupplierName',
    type: String,
  })
  supplierName: string;

  @ApiProperty({
    description: 'Order destination id',
    type: Number,
    required: false,
  })
  destinationId?: number;

  @ApiProperty({
    description: 'Order reply deadline',
    type: Date,
    required: false,
  })
  replyDeadline?: Date;

  @ApiProperty({ description: 'Order requested deadline', type: Date })
  requestedDeadline: Date;

  @ApiProperty({ description: 'Order updated by', type: Number })
  updatedBy: number;

  @ApiProperty({ description: 'Order updated by user name', type: String })
  updatedByUserName: string;

  @ApiProperty({ description: 'Order memo', type: String, required: false })
  memo?: string;

  @ApiProperty({ description: 'Order confirmed', type: Boolean })
  isRead?: boolean;
}

export class ListOrderDto extends CommonListResponse<OrderItemListDto> {
  @ApiProperty({
    description: 'List users',
    type: OrderItemListDto,
    isArray: true,
    default: [],
  })
  items: OrderItemListDto[];
}
