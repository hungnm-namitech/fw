import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserJwt } from 'src/auth/auth.interface';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwt;
    const companyCd = request.params?.companyCd;
    if (!user.companyCd || user.companyCd !== companyCd) {
      return false;
    }
    return true;
  }
}
