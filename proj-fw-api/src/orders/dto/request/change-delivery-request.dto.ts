import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangeDeliveryDateRequest {
  @ApiProperty({ description: 'Change deadline date', type: Date })
  @IsNotEmpty()
  changeDealine: Date;

  @ApiProperty({ description: 'Memo', type: String, required: false })
  @IsOptional()
  @IsString()
  memo?: string;
}
