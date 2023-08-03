import { isDate, isObject, snakeCase } from 'lodash';

/**
 * Type definition for data that can be transformed by the `ResponseTransformer`.
 * The data can be of a specific type `T` or a record of string keys to any values.
 */
export type TransformableData<T> = T | Record<string, any>;

/**
 * Class to handle the transformation of response data.
 * Primarily used to convert all keys to snake_case and date instances to ISO strings.
 */
export class ResponseTransformer {
  /**
   * Transforms all keys in a data structure to snake_case and converts Date objects to ISO strings.
   * The method works recursively to handle complex nested structures.
   *
   * @param {TransformableData<T>} data - The data to transform.
   *
   * The transformation process is as follows:
   * 1. If an item is an array, the method maps through the array and applies `transformToSnakeCase` recursively.
   * 2. If an item is an object, the method transforms all keys to snake_case using lodash's `snakeCase` function.
   * 3. If the value of a key in the object is also an object (and not an array), the method applies `transformToSnakeCase` recursively.
   * 4. If the value of a key in the object is an instance of Date, the method converts it to an ISO string using `Date.prototype.toISOString`.
   *
   * @returns {TransformableData<T>} The transformed data with all keys in snake_case and all Date objects converted to ISO strings.
   */
  public static transformToSnakeCase<T>(
    data: TransformableData<T>,
  ): TransformableData<T> {
    if (Array.isArray(data)) {
      return data.map((item) => ResponseTransformer.transformToSnakeCase(item));
    } else if (isObject(data)) {
      return Object.keys(data).reduce((result, key) => {
        let value = data[key];
        if (Array.isArray(value)) {
          value = value.map((item) =>
            ResponseTransformer.transformToSnakeCase(item),
          );
        } else if (isDate(value)) {
          value = value.toISOString();
        } else if (isObject(value)) {
          value = ResponseTransformer.transformToSnakeCase(value);
        }
        result[snakeCase(key)] = value;
        return result;
      }, {});
    }
    return data;
  }
}
