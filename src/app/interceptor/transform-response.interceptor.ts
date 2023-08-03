import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseTransformer, TransformableData } from '../utility';

/**
 * An interceptor that transforms outgoing response data, converting
 * all keys to snake_case. It also converts date objects to ISO strings.
 *
 * @template T The type of the data to transform.
 *
 * @decorator @Injectable()
 * @implements NestInterceptor
 */
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, TransformableData<T>>
{
  /**
   * Method that is called for each request.
   *
   * @param context The execution context.
   * @param next The call handler, which handles the request after the interceptor finishes.
   * @returns An Observable that is transformed to snake case by the interceptor.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformableData<T>> {
    return next.handle().pipe(map(ResponseTransformer.transformToSnakeCase));
  }
}
