import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isDate, isObject, snakeCase } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ResponseData<T> = T | Record<string, any>;

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
  implements NestInterceptor<T, ResponseData<T>>
{
  /**
   * Constructs a new instance of `TransformResponseInterceptor`, and binds the `this` context
   * for the `transformToSnakeCase` method to the instance of the class. This is necessary to ensure
   * that the method has the correct `this` context when it's used within a callback in `pipe(map())`.
   */
  constructor() {
    this.transformToSnakeCase = this.transformToSnakeCase.bind(this);
  }

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
   * Recursively transforms all keys in a data structure to snake_case and converts Date objects to ISO strings.
   *
   * Iterates over data and applies the following transformations:
   * 1. If an item is an array, maps through the array and applies `transformToSnakeCase` recursively.
   * 2. If an item is an object, transforms all keys to snake_case.
   * 3. If the value of a key in the object is also an object (and not an array), applies `transformToSnakeCase` recursively.
   * 4. If the value of a key in the object is an instance of Date, converts it to an ISO string.
   *
   * @param {ResponseData<T>} data The data to transform.
   * @returns {ResponseData<T>} The transformed data with all keys in snake_case and all Date objects converted to ISO strings.
   */
  transformToSnakeCase(data: ResponseData<T>): ResponseData<T> {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformToSnakeCase(item));
    } else if (isObject(data)) {
      return Object.keys(data).reduce((result, key) => {
        let value = data[key];
        if (Array.isArray(value)) {
          value = value.map((item) => this.transformToSnakeCase(item));
        } else if (isDate(value)) {
          value = value.toISOString();
        } else if (isObject(value)) {
          value = this.transformToSnakeCase(value);
        }
        result[snakeCase(key)] = value;
        return result;
      }, {});
    }
    return data;
  }
}
