import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseException } from 'src/shared/exception/common.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const queryToken = request.query.token;
    const configToken = this.configService.get('seederToken');
    if (queryToken !== configToken) {
      throw new ResponseException(HttpStatus.UNAUTHORIZED, 'Invalid token');
    }

    return true;
  }
}
