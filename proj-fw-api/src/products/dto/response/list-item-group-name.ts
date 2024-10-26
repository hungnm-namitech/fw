import { ApiProperty } from '@nestjs/swagger';

export class ItemGroupNameDto {
  @ApiProperty({ description: 'Item group id', type: Number })
  id: number;

  @ApiProperty({ description: 'Item group name', type: String })
  itemName: string;
}
