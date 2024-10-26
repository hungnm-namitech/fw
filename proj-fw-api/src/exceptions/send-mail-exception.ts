import { HttpException, HttpStatus } from '@nestjs/common';

export class SendMailException extends HttpException {
  constructor() {
    super(
      {
        message: 'Email sending failed.',
        errorCode: 'SEND_MAIL_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
