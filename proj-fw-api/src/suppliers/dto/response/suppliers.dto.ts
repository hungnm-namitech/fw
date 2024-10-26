import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class ParentSupplierDto {
  @ApiProperty({ description: 'Supplier id', type: String })
  supplierCd: string;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;
}

export class SupplierDto {
  @ApiProperty({ description: 'Supplier id', type: String })
  supplierCd: string;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;

  @ApiProperty({ description: 'Supplier name kana', type: String })
  supplierNameKana: string;

  @ApiProperty({ description: 'Tel', type: String })
  tel: string;

  @ApiProperty({ description: 'Post code', type: String })
  postCd: string;

  @ApiProperty({ description: 'Address', type: String })
  address1: string;
}

export class SupplierItemListDto {
  @ApiProperty({ description: 'Supplier cd', type: String })
  supplierCd: string;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;

  @ApiProperty({ description: 'Supplier name kana', type: String })
  supplierNameKana: string;

  @ApiProperty({ description: 'Tel', type: String })
  tel: string;

  @ApiProperty({ description: 'Post code', type: String })
  postCd: string;

  @ApiProperty({ description: 'Address', type: String })
  address: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3: string;
}

export class ListSupplierDto extends CommonListResponse<SupplierItemListDto> {
  @ApiProperty({
    description: 'List companies',
    type: SupplierItemListDto,
    isArray: true,
    default: [],
  })
  items: SupplierItemListDto[];
}

export class SupplierDetailDto {
  @ApiProperty({ description: 'Supplier id', type: String })
  supplierCd: string;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;

  @ApiProperty({ description: 'Supplier name kana', type: String })
  supplierNameKana: string;

  @ApiProperty({ description: 'Tel', type: String })
  tel: string;

  @ApiProperty({ description: 'Post code', type: String })
  postCd: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3: string;
}