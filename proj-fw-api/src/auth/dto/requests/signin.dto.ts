import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'User id to sign in', type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password to sign in', type: String })
  @IsNotEmpty()
  password: string;
}
