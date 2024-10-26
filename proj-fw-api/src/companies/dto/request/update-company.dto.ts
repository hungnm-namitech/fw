import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'id', type: String })
  id: string;

  @ApiProperty({ description: 'Company name', type: String })
  @MaxLength(128)
  companyName: string;

  @ApiProperty({ description: 'Company name', type: String })
  @MaxLength(128)
  companyNameKana: string;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Post code', type: String, required: false })
  postCd?: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3: string;
}
