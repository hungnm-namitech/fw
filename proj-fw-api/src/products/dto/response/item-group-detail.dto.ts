import { ApiProperty } from '@nestjs/swagger';

class ItemDetail {
  @ApiProperty({ description: 'Item detail id', type: Number })
  id: number;

  @ApiProperty({ description: 'Item length(mm)', type: Number })
  width: number;

  @ApiProperty({ description: 'Item thickness(mm)', type: Number })
  thickness: number;

  @ApiProperty({ description: 'Item length(mm)', type: Number })
  length: number;

  @ApiProperty({ description: 'Item volume(m3)', type: Number })
  itemVolume: number;

  @ApiProperty({ description: 'Quantity per pack', type: Number })
  quantityPerPack: number;

  @ApiProperty({ description: 'Unit price', type: Number })
  unitPrice: number;
}

export class ItemGroupDetailDto {
  @ApiProperty({ description: 'Item name', type: String })
  itemName: string;

  @ApiProperty({ description: 'Monthly Forecast', type: Number })
  monthlyForecast: number;

  @ApiProperty({ description: 'Total order quantity', type: Number })
  totalOrderQuantity: number;

  @ApiProperty({
    description: 'List item detail',
    type: ItemDetail,
    isArray: true,
  })
  itemDetails: ItemDetail[];
}
