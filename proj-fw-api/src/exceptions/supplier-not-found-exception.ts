import { HttpException, HttpStatus } from '@nestjs/common';

export class SupplierNotFoundException extends HttpException {
  constructor(status: HttpStatus) {
    super(
      {
        message: 'Supplier not found',
        errorCode: 'SUPPLIER_NOT_FOUND',
        status: status || HttpStatus.NOT_FOUND,
      },
      status || HttpStatus.NOT_FOUND,
    );
  }
}
