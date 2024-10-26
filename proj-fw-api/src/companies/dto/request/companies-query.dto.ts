import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { COMPANY_ORDER_BY } from 'src/companies/companies.constant';
import { CommonQueryList } from 'src/utils/api.request';

export class CompaniesQueryDto extends CommonQueryList {
  @ApiProperty({ description: 'Company cd', type: Number, required: false })
  companyCd?: number;

  @ApiProperty({ description: 'Company name', type: String, required: false })
  companyName?: string;
  
  @ApiProperty({ description: 'Company tel', type: String, required: false })
  tel?: string;

  @ApiProperty({ description: 'Company address', type: String, required: false })
  address?: string;

  @ApiProperty({
    description: 'Order by field',
    type: String,
    required: false,
    enum: COMPANY_ORDER_BY,
  })
  @IsOptional()
  @IsEnum(COMPANY_ORDER_BY)
  sortBy?: string;
}
