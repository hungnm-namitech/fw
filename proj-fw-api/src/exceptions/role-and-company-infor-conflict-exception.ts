import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleAndCompanyInforConflictException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid role and company information',
        errorCode: 'INVALID_ROLE_AND_COMPANY_INFOR',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
