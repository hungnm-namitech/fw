import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BASE_ORDER_BY } from 'src/bases/bases.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class BasesQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'Base id', type: Number, required: false })
  id?: number;

  @ApiProperty({ description: 'Base name', type: String, required: false })
  baseName?: string;

  @ApiProperty({ description: 'Company cd', type: String, required: false })
  companyCd?: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: BASE_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(BASE_ORDER_BY)
  sortBy?: string;
}
