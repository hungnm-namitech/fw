import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class BaseItemListDto {
  @ApiProperty({ description: 'Base id', type: Number })
  id: number;

  @ApiProperty({ description: 'Base name', type: String })
  baseName: string;

  @ApiProperty({ description: 'Base name kana', type: String, required: false })
  baseNameKana?: string;

  @ApiProperty({ description: 'Company name', type: String, required: false })
  companyName?: string;

  @ApiProperty({ description: 'Base div', type: Number })
  baseDiv: number;

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

export class ListBaseDto extends CommonListResponse<BaseItemListDto> {
  @ApiProperty({
    description: 'List bases',
    type: BaseItemListDto,
    isArray: true,
    default: [],
  })
  items: BaseItemListDto[];
}

export class BaseDetailDto {
  @ApiProperty({ description: 'Base id', type: Number })
  id: number;

  @ApiProperty({ description: 'Base name', type: String })
  baseName: string;

  @ApiProperty({ description: 'Base name kana', type: String, required: false })
  baseNameKana?: string;

  @ApiProperty({ description: 'Base div', type: Number })
  baseDiv: number;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Post code', type: String, required: false })
  postCode?: string;

  @ApiProperty({ description: 'Address1', type: String })
  address1: string;

  @ApiProperty({ description: 'Address2', type: String })
  address2: string;

  @ApiProperty({ description: 'Address3', type: String })
  address3: string;

  @ApiProperty({ description: 'Company cd', type: String, required: false })
  companyCd?: string;
}
