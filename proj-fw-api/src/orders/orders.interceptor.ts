import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class OrderTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const removeUnuseKey = (body: any) => {
      delete body.itemDetails;
      delete body.temporalyFlag;
      delete body.customerId;
      delete body.purchasingAgent;
    };

    const mapBodyOrder = (body: any) => {
      if (body.itemDetails?.length) {
        body.productDetails = body.itemDetails.map(
          ({ itemDetailId, quantity }) => ({
            quantity,
            productDetailCd: itemDetailId.toString(),
          }),
        );
      }
      body.temporaryFlag =
        body.temporaryFlag !== undefined
          ? body.temporaryFlag
          : body.temporalyFlag;
      body.staffId =
        body.staffId !== undefined ? body.staffId : body.customerId;
      if (!body.staffId) {
        body.staffId = null;
      }
    };

    const mapProductCd = (product: any) => {
      return product.hasOwnProperty('productCd')
        ? {
            id: product.productCd,
            productDetailId: product.productDetailCd,
            ...product,
          }
        : product;
    };

    const mapResponseOrder = (body: any) => {
      return {
        ...body,
        itemDetails: body.productDetails
          ? (body.productDetails || []).map(mapProductCd)
          : undefined,
        temporalyFlag: body.temporaryFlag,
        customerId: body.staffId,
      };
    };

    const request = context.switchToHttp().getRequest();
    const body = request.body;

    mapBodyOrder(body);
    removeUnuseKey(body);

    return next.handle().pipe(
      map((companyResponse) => {
        return mapResponseOrder(companyResponse);
      }),
    );
  }
}
