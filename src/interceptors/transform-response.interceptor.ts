import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isObject, mapKeys, snakeCase } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ResponseData<T> = T | Record<string, any>;

/**
 * An interceptor that transforms outgoing response data, converting
 * all keys to snake_case.
 *
 * @template T The type of the data to transform.
 *
 * @decorator @Injectable()
 * @implements NestInterceptor
 */
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>>
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
  ): Observable<ResponseData<T>> {
    return next.handle().pipe(map(this.transformToSnakeCase));
  }

  /**
   * Recursively transforms all keys in a data structure to snake_case.
   *
   * @param data The data to transform.
   * @returns The transformed data.
   */
  transformToSnakeCase(data: ResponseData<T>): ResponseData<T> {
    if (Array.isArray(data)) {
      return data.map(this.transformToSnakeCase);
    } else if (isObject(data)) {
      const transformed = mapKeys(data, (_, key) => snakeCase(String(key)));
      for (const key in transformed) {
        if (isObject(transformed[key])) {
          transformed[key] = this.transformToSnakeCase(transformed[key]);
        }
      }
      return transformed;
    } else {
      return data;
    }
  }
}
