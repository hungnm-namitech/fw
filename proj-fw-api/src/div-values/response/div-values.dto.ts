import { ApiProperty } from '@nestjs/swagger';

export class DivValueItemListDto {
  @ApiProperty({ description: 'Div value', type: Number })
  divValue: number;

  @ApiProperty({ description: 'Div value name', type: String })
  divValueName: string;
}
