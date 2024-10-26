import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { DEFAULT_SALT_ROUND } from 'src/shared/bcrypt/bcrypt.constant';

@Injectable()
export class BcryptService {
  constructor() {}

  async hashPassword(plainPassword: string, saltRound = DEFAULT_SALT_ROUND) {
    const salt = await genSalt(saltRound);
    const hashedPassword = await hash(plainPassword, salt);

    return hashedPassword;
  }

  async comparePassword(plainPassword: string, hashedPassword: string) {
    return compare(plainPassword, hashedPassword);
  }
}
