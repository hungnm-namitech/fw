import { ApiProperty } from '@nestjs/swagger';

class CommercialFlow {
  @ApiProperty({ description: 'Commercial flow id', type: Number })
  id: number;

  @ApiProperty({
    description: 'Trading company 1',
    type: String,
    required: false,
  })
  tradingCompany1: string;

  @ApiProperty({
    description: 'Trading company 1',
    type: String,
    required: false,
  })
  tradingCompany2: string;

  @ApiProperty({
    description: 'Trading company 1',
    type: String,
    required: false,
  })
  tradingCompany3: string;

  @ApiProperty({
    description: 'Trading company 1',
    type: String,
    required: false,
  })
  tradingCompany4: string;
}

export class ItemGroupDto {
  @ApiProperty({ description: 'Item id', type: Number })
  id: number;

  @ApiProperty({ description: 'Item name', type: String })
  itemName: string;

  @ApiProperty({ description: 'Icon file name', type: String, required: false })
  iconFileName?: string;

  @ApiProperty({ description: 'Display div', type: Number, required: false })
  displayDiv?: number;

  @ApiProperty({ description: 'Supplier name', type: String })
  supplierName: string;

  @ApiProperty({
    description: 'List commercial_flow',
    type: CommercialFlow,
    isArray: true,
  })
  commercialFlows: CommercialFlow[];
}
