import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseException extends HttpException {
  constructor(status?: HttpStatus, message?: string, data?: any, errorCode?: string) {
    super(
      {
        status: status,
        message: message || 'Invalid data',
        data: data || null,
        errorCode: errorCode || ""
      },
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
