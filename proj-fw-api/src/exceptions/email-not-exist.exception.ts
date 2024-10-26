import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotExistException extends HttpException {
  constructor() {
    super(
      {
        message: 'Email not exist',
        errorCode: 'EMAIL_NOT_EXIST',
        statuc: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
