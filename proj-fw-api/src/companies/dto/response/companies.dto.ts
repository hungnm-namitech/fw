import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class CompanyDto {
  @ApiProperty({ description: 'Company id', type: Number })
  id: number;

  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;
}

export class CompanyItemListDto {
  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Post code', type: String, required: false })
  postcode?: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1?: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2?: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3?: string;

  @ApiProperty({ description: 'Address', type: String })
  address?: string;
}

export class ListCompanyDto extends CommonListResponse<CompanyItemListDto> {
  @ApiProperty({
    description: 'List companies',
    type: CompanyItemListDto,
    isArray: true,
    default: [],
  })
  items: CompanyItemListDto[];
}

export class CompanyDetailDto {
  @ApiProperty({ description: 'Company id', type: String })
  id: string;

  @ApiProperty({ description: 'Company name', type: String })
  companyName: string;

  @ApiProperty({ description: 'Company name kana', type: String })
  companyNameKana?: string;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Post code', type: String, required: false })
  postcode?: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3: string;
}
