import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { USER_ROLE } from 'src/constants/common';
import { USER_ORDER_BY } from 'src/users/users.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class UsersQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'User id', type: String, required: false })
  userId?: string;

  @ApiProperty({ description: 'User name', type: String, required: false })
  username?: string;

  @ApiProperty({ description: 'User email', type: String, required: false })
  @IsOptional()
  mailAddress?: string;

  @ApiProperty({
    description: 'JP phone number',
    type: String,
    required: false,
  })
  @IsOptional()
  tel?: string;

  @ApiProperty({
    description: 'Company name',
    type: String,
    required: false,
  })
  companyName?: string;

  @ApiProperty({
    description: 'User role',
    type: String,
    required: false,
    enum: Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2),
  })
  @IsOptional()
  @IsEnum(Object.keys(USER_ROLE).slice(0, Object.keys(USER_ROLE).length / 2))
  roleDiv?: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: USER_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(USER_ORDER_BY)
  sortBy?: string;
}
