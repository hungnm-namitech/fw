import { ApiProperty } from '@nestjs/swagger';
import { ProductDetailDto } from 'src/product-details/dto/response/product-detail.dto';
import { ORDER_STATUS_DIV } from 'src/orders/orders.constant';
import { OrderActionDto } from './order-action.dto';

export class OrderDetailForPCDto {
  @ApiProperty({ description: 'Order id', type: Number })
  id: number;

  @ApiProperty({
    description: 'Order status',
    type: Number,
    enum: ORDER_STATUS_DIV,
  })
  statusDiv: number;

  @ApiProperty({ description: 'Order created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Order updated at', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: 'Order requested deadline', type: Date })
  requestedDeadline: Date;

  @ApiProperty({
    description: 'Order trading company',
    type: String,
    required: false,
  })
  tradingCompany: string;

  @ApiProperty({
    description: 'Order reply deadline',
    type: Date,
    required: false,
  })
  replyDeadline?: Date;

  @ApiProperty({ description: 'Base id', type: Number, required: false })
  baseId?: number;

  @ApiProperty({ description: 'Base name', type: String, required: false })
  baseName?: string;

  @ApiProperty({ description: 'Base tel', type: String, required: false })
  baseTelNumber?: string;

  @ApiProperty({ description: 'Base address 1', type: String, required: false })
  baseAddress1?: string;

  @ApiProperty({ description: 'Order mixed loading flag', type: Boolean })
  mixedLoadingFlag: boolean;

  @ApiProperty({ description: 'Order vehicle class div', type: String })
  vehicleClassDiv: string;

  @ApiProperty({ description: 'Order order quantity', type: Number })
  orderQuantity: number;

  @ApiProperty({
    description: 'Order memo',
    type: String,
    required: false,
  })
  memo?: string;

  @ApiProperty({ description: 'Company staff id', type: Number })
  staffId: number;

  @ApiProperty({ description: 'Item display div', type: String })
  itemDisplayDiv: string;

  @ApiProperty({ description: 'Item name', type: String })
  itemName: string;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;

  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;

  @ApiProperty({ description: 'Commercial flow id', type: String })
  commercialFlowId: string;

  @ApiProperty({ description: 'item cd', type: String })
  itemCd: string;

  @ApiProperty({
    description: 'Product detail list',
    type: ProductDetailDto,
    isArray: true,
  })
  productDetails: ProductDetailDto[];

  @ApiProperty({
    description: 'Order actions',
    type: OrderActionDto,
    isArray: true,
  })
  actions: OrderActionDto[];
}
