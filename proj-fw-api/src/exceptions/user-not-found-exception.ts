import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
