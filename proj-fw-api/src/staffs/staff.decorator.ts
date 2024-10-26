import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserJwt } from 'src/auth/auth.interface';

export const RequestUser = createParamDecorator(
  (data: keyof UserJwt, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserJwt | null = request.user;

    return data ? user?.[data] : user;
  },
);
