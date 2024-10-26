import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ItemGroupDetailQuery {
  @ApiProperty({ description: 'Commercial flow id', type: String })
  @IsNotEmpty()
  commercialFlowId: string;
}
