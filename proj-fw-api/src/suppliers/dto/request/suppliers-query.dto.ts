import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SUPPLIER_ORDER_BY } from 'src/suppliers/suppliers.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class SuppliersQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'Supplier cd', type: Number, required: false })
  supplierCd: number;

  @ApiProperty({ description: 'Supplier name', type: String, required: false })
  supplierName: string;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel: string;

  @ApiProperty({ description: 'Address1', type: String, required: false })
  address: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: SUPPLIER_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(SUPPLIER_ORDER_BY)
  sortBy?: string;
}
