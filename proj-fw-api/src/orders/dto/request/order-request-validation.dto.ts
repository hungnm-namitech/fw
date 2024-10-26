import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ORDER_ACTION_CONFIRMATION } from 'src/orders/orders.constant';

export class OrderRequestValidationDto {
  @ApiProperty({
    description: 'Action accept or refuse request',
    type: String,
    enum: ORDER_ACTION_CONFIRMATION,
  })
  @IsEnum(ORDER_ACTION_CONFIRMATION)
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Deadline date ', type: Date, required: false })
  @IsOptional()
  @IsDateString()
  deadlineDate?: Date;

  @ApiProperty({
    description: 'Memo',
    type: String,
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  memo?: string;
}
