import { ApiProperty } from '@nestjs/swagger';

export class OrderActionDto {
  @ApiProperty({ description: 'Order action id', type: Number })
  id: number;

  @ApiProperty({ description: 'Action div', type: Number })
  actionDiv: number;

  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;

  @ApiProperty({ description: 'User name', type: String })
  userName: string;

  @ApiProperty({ description: 'Memo', type: String, required: false })
  memo?: string;
}
