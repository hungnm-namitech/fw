import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({ description: 'Staff name', type: String })
  @IsOptional()
  @MaxLength(128)
  staffName?: string;

  @ApiProperty({ description: 'Staff name kana', type: String })
  @IsOptional()
  @MaxLength(128)
  staffNameKana?: string;

  @ApiProperty({ description: 'Company cd', type: String })
  @IsOptional()
  companyCd?: string;
}
