import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumber, IsOptional } from 'class-validator';

export class BatchUpdateReplyDeadlineDto {
  @ApiProperty({
    description: 'List order id',
    type: Number,
    isArray: true,
    minLength: 1,
  })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  orderIds: number[];

  @ApiProperty({ description: 'Memo', type: String, required: false })
  @IsOptional()
  memo?: string;
}
