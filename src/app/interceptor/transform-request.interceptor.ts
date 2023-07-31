import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { camelCase, isObject, mapKeys } from 'lodash';
import { Observable } from 'rxjs';

/**
 * An interceptor that transforms incoming request payloads, converting
 * all keys to camelCase.
 *
 * @decorator @Injectable()
 * @implements NestInterceptor
 */
@Injectable()
export class TransformRequestInterceptor implements NestInterceptor {
  /**
   * Method that is called for each request.
   *
   * @param context The execution context.
   * @param next The call handler, which handles the request after the interceptor finishes.
   * @returns An Observable that is handled by Nest.js.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.body = this.transformToCamelCase(request.body);
    return next.handle();
  }

  /**
   * Recursively transforms all keys in a data structure to camelCase.
   *
   * @param data The data to transform.
   * @returns The transformed data.
   */
  transformToCamelCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformToCamelCase(item));
    } else if (isObject(data)) {
      const transformed: Record<string, any> = mapKeys(data, (_, key) =>
        camelCase(key),
      );
      for (const key in transformed) {
        if (isObject(transformed[key])) {
          transformed[key] = this.transformToCamelCase(transformed[key]);
        }
      }
      return transformed;
    } else {
      return data;
    }
  }
}
