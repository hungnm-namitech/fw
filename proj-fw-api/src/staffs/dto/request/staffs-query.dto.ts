import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { STAFF_ORDER_BY } from 'src/staffs/staffs.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class StaffsQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'Staff id', type: Number, required: false })
  id?: number;

  @ApiProperty({ description: 'Staff name', type: String, required: false })
  staffName?: string;

  @ApiProperty({ description: 'Company cd', type: String, required: false })
  companyCd?: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: STAFF_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(STAFF_ORDER_BY)
  sortBy?: string;
}
