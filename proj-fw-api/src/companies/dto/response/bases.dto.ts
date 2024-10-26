import { ApiProperty } from '@nestjs/swagger';

export class CompanyBaseDto {
  @ApiProperty({ description: 'Base id', type: Number })
  id: number;

  @ApiProperty({ description: 'Base name', type: String })
  baseName: string;

  @ApiProperty({ description: 'Tel number', type: String })
  telNumber: string;

  @ApiProperty({ description: 'Base address1', type: String, required: false })
  address1?: string;
}
