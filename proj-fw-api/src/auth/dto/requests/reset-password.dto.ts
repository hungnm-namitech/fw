import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'User email', type: String })
  @IsEmail()
  mailAddress: string;
}
