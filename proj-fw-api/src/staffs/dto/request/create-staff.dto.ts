import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'Staff name', type: String })
  @IsNotEmpty()
  @MaxLength(128)
  staffName: string;

  @ApiProperty({ description: 'Staff name kana', type: String })
  @IsOptional()
  @MaxLength(128)
  staffNameKana?: string;

  @ApiProperty({ description: 'Company cd', type: String })
  @IsOptional()
  companyCd?: string;
}
