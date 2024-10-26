import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { USER_ROLE } from 'src/constants/common';
import { IsKatagana, IsPhoneNumberJP } from 'src/users/user.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'User id', type: String })
  @ValidateIf((obj, value) => !!value)
  @MinLength(5)
  @MaxLength(50)
  userId: string;

  @ApiProperty({ description: 'User name', type: String })
  @IsNotEmpty()
  @MaxLength(128)
  username: string;

  @ApiProperty({ description: 'User name kana', type: String })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(128)
  @IsKatagana()
  usernameKana?: string;

  @ApiProperty({ description: 'User email', type: String })
  mailAddress: string;

  @ApiProperty({ description: 'User tel', type: String })
  @ValidateIf((obj, value) => !!value)
  @IsPhoneNumberJP()
  tel?: string;

  @ApiProperty({ description: 'User role', type: Number, enum: USER_ROLE })
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  roleDiv: number;

  @ApiProperty({ description: 'User password', type: Number })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  password: string;

  @ApiProperty({ description: 'Company id or supplier id', type: String })
  @IsOptional()
  companyId?: string;
}
