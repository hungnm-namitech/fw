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
export class CompanyTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const mapCompanyCd = (company: any) => {
      return company.hasOwnProperty('companyCd')
        ? { id: company.companyCd, ...company }
        : company;
    };

    return next.handle().pipe(
      map((companyResponse) => {
        if (isArray(companyResponse)) {
          return companyResponse.map((companyRecord) =>
            mapCompanyCd(companyRecord),
          );
        }

        return mapCompanyCd(companyResponse);
      }),
    );
  }
}
