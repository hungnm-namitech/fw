import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class StaffItemListDto {
  @ApiProperty({ description: 'Staff id', type: Number })
  id: number;

  @ApiProperty({ description: 'Staff name', type: String })
  staffName: string;

  @ApiProperty({
    description: 'Staff name kana',
    type: String,
    required: false,
  })
  staffNameKana?: string;

  @ApiProperty({ description: 'Company name', type: String, required: false })
  companyName?: string;

  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}

export class ListStaffDto extends CommonListResponse<StaffItemListDto> {
  @ApiProperty({
    description: 'List staffs',
    type: StaffItemListDto,
    isArray: true,
    default: [],
  })
  items: StaffItemListDto[];
}

export class StaffDetailDto {
  @ApiProperty({ description: 'Staff id', type: Number })
  id: number;

  @ApiProperty({ description: 'Staff name', type: String })
  staffName: string;

  @ApiProperty({
    description: 'Staff name kana',
    type: String,
    required: false,
  })
  staffNameKana?: string;

  @ApiProperty({ description: 'Company cd', type: String, required: false })
  companyCd?: string;

  @ApiProperty({ description: 'Created by', type: Number, required: false })
  createdBy?: number;

  @ApiProperty({ description: 'Updated by', type: Number, required: false })
  updatedBy?: number;

  @ApiProperty({ description: 'Created at', type: Date, required: false })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated at', type: Date, required: false })
  updatedAt?: Date;
}
