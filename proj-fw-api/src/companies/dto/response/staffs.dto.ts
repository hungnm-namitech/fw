import { ApiProperty } from '@nestjs/swagger';

export class CompanyStaffDto {
  @ApiProperty({ description: 'Staff id', type: Number })
  id: number;

  @ApiProperty({ description: 'Staff name', type: String })
  staffName: string;
}
