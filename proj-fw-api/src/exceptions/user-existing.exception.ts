import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistingException extends HttpException {
  constructor() {
    super(
      {
        message: 'The user already exists with the email or user id posted',
        errorCode: 'USER_EXISTING',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
