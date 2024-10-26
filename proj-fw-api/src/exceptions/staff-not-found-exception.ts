import { HttpException, HttpStatus } from '@nestjs/common';

export class StaffNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'Staff not found',
        errorCode: 'STAFF_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
