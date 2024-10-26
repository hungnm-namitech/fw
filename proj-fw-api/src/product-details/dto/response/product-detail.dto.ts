import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailDto {
  @ApiProperty({ description: 'Item detail id', type: Number })
  id: number;

  @ApiProperty({ description: 'Item width', type: Number })
  width: number;

  @ApiProperty({ description: 'Item thickness', type: Number })
  thickness: number;

  @ApiProperty({ description: 'Item length', type: Number })
  length: number;

  @ApiProperty({ description: 'Item quantity per pack', type: Number })
  quantityPerPack: number;

  @ApiProperty({ description: 'Item quantity per pack', type: Number })
  quantity: number;

  @ApiProperty({ description: 'Desire quantity', type: Number })
  desireQuantity: number;

  @ApiProperty({ description: 'Grade strength', type: String })
  gradeStrength: number;

  @ApiProperty({ description: 'Product name', type: String })
  productName: number;

  @ApiProperty({ description: 'Item volume', type: Number })
  itemVolume: number;
}
