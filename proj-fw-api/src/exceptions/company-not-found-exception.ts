import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'Company not found',
        errorCode: 'COMPANY_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
