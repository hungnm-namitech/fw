import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateBaseDto {
  @ApiProperty({ description: 'Base name', type: String })
  @MaxLength(128)
  baseName: string;

  @ApiProperty({ description: 'Base name kana', type: String })
  @MaxLength(128)
  @IsOptional()
  baseNameKana?: string;

  @ApiProperty({ description: 'Base tel', type: String })
  @MaxLength(13)
  @IsOptional()
  telNumber?: string;

  @ApiProperty({ description: 'post code', type: String })
  @MaxLength(7)
  @IsOptional()
  postCode?: string;

  @ApiProperty({ description: 'address1', type: String })
  @MaxLength(256)
  @IsOptional()
  address1?: string;

  @ApiProperty({ description: 'address2', type: String })
  @MaxLength(256)
  @IsOptional()
  address2?: string;

  @ApiProperty({ description: 'address3', type: String })
  @MaxLength(256)
  @IsOptional()
  address3?: string;

  @ApiProperty({ description: 'company cd', type: String })
  @IsNotEmpty()
  companyCd: string;
}
