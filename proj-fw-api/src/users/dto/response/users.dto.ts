import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/utils';

export class UserItemListDto {
  @ApiProperty({ description: 'Master user id', type: Number })
  mUserId: number;

  @ApiProperty({ description: 'User id', type: String })
  userId: string;

  @ApiProperty({ description: 'User name', type: String })
  username: string;

  @ApiProperty({ description: 'User name kana', type: String, required: false })
  usernameKana?: string;

  @ApiProperty({ description: 'Mail address', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'Role div', type: Number })
  roleDiv: number;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Company name', type: String, required: false })
  companyName?: string;

  @ApiProperty({ description: 'Supplier name', type: String, required: false })
  supplierName?: string;

  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}

export class ListUserDto extends CommonListResponse<UserItemListDto> {
  @ApiProperty({
    description: 'List users',
    type: UserItemListDto,
    isArray: true,
    default: [],
  })
  items: UserItemListDto[];
}

export class UserDetailDto {
  @ApiProperty({ description: 'Master user id', type: Number })
  mUserId: number;

  @ApiProperty({ description: 'User id', type: String })
  userId: string;

  @ApiProperty({ description: 'User name', type: String })
  username: string;

  @ApiProperty({ description: 'User name kana', type: String, required: false })
  usernameKana?: string;

  @ApiProperty({ description: 'Mail address', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'Role div', type: Number })
  roleDiv: number;

  @ApiProperty({ description: 'Created by', type: Number })
  createdBy: number;

  @ApiProperty({ description: 'Updated by', type: Number })
  updatedBy: number;

  @ApiProperty({ description: 'Tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Company name', type: Number, required: false })
  companyId?: number;

  @ApiProperty({ description: 'Supplier name', type: Number, required: false })
  supplierId?: number;

  @ApiProperty({ description: 'Created at', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', type: Date })
  updatedAt: Date;
}
