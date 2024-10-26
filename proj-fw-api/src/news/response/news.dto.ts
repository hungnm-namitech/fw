import { ApiProperty } from '@nestjs/swagger';

export class NewItemListDto {
  @ApiProperty({ description: 'Title', type: String })
  title: string;

  @ApiProperty({ description: 'Publication start date', type: Date })
  publicationStartDate: Date;

  @ApiProperty({ description: 'id', type: Number })
  id: Number;
}
