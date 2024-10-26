import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'Base not found',
        errorCode: 'BASE_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
