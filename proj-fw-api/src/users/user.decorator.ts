import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { REGEX_KATAGANA, REGEX_PHONE_JP } from './users.constant';
import { UserJwt } from 'src/auth/auth.interface';

export function IsPhoneNumberJP() {
  return applyDecorators(
    ApiProperty({ description: 'Phone number in Japan format' }),
    IsString(),
    Matches(REGEX_PHONE_JP, { message: 'Phone number is not valid' }),
  );
}
export function IsKatagana() {
  return applyDecorators(
    ApiProperty({
      description: 'Must be followed by katagana format',
    }),
    IsString(),
    Matches(REGEX_KATAGANA, {
      message: 'Must be followed by katagana format',
    }),
  );
}

export const RequestUser = createParamDecorator(
  (data: keyof UserJwt, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserJwt | null = request.user;

    return data ? user?.[data] : user;
  },
);
