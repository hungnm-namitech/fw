import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class SupplierTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const mapSupplierCd = (supplier: any) => {
      return supplier.hasOwnProperty('supplierCd')
        ? { id: supplier.supplierCd, ...supplier }
        : supplier;
    };

    return next.handle().pipe(
      map((supplierResponse) => {
        if (isArray(supplierResponse)) {
          return supplierResponse.map((supplierRecord) =>
            mapSupplierCd(supplierRecord),
          );
        }

        return mapSupplierCd(supplierResponse);
      }),
    );
  }
}
