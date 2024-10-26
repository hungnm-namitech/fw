import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { USER_ROLE } from 'src/constants/common';
import { isString, isNotEmpty, max } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<CreateUserDto> {
  async transform(value: CreateUserDto, { metatype }: ArgumentMetadata) {
    if (+value.roleDiv === USER_ROLE.ADMIN) {
      const email = value.mailAddress;
      const isValid =
        isString(email) && isNotEmpty(email) && max(email.length, 256);

      if (!isValid) {
        throw new BadRequestException('Invalid parameter');
      }
    }

    if (
      +value.roleDiv === USER_ROLE.SUPPLIER ||
      +value.roleDiv === USER_ROLE.PC
    ) {
      if (!isNotEmpty(value.companyId)) {
        throw new BadRequestException('Invalid parameter');
      }
    }

    return value;
  }
}
