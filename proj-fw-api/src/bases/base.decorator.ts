import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserJwt } from 'src/auth/auth.interface';

export const RequestBase = createParamDecorator(
  (data: keyof UserJwt, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const base: UserJwt | null = request.base;

    return data ? base?.[data] : base;
  },
);
