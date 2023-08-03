import { ResponseTransformer } from './response-transformer.utility';

describe('ResponseTransformer', () => {
  describe('transformToSnakeCase', () => {
    it('should transform object keys to snake_case', () => {
      const data = { helloWorld: 'foo', anotherKey: 'bar' };
      const transformed = ResponseTransformer.transformToSnakeCase(data);
      expect(transformed).toEqual({ hello_world: 'foo', another_key: 'bar' });
    });

    it('should handle nested objects', () => {
      const data = { helloWorld: { nestedKey: 'foo' } };
      const transformed = ResponseTransformer.transformToSnakeCase(data);
      expect(transformed).toEqual({ hello_world: { nested_key: 'foo' } });
    });

    it('should handle arrays', () => {
      const data = [{ helloWorld: 'foo' }, { anotherKey: 'bar' }];
      const transformed = ResponseTransformer.transformToSnakeCase(data);
      expect(transformed).toEqual([
        { hello_world: 'foo' },
        { another_key: 'bar' },
      ]);
    });

    it('should handle dates', () => {
      const date = new Date('2020-01-01T00:00:00.000Z');
      const data = { date };
      const transformed = ResponseTransformer.transformToSnakeCase(data);
      expect(transformed).toEqual({ date: '2020-01-01T00:00:00.000Z' });
    });

    it('should handle complex structures', () => {
      const date = new Date('2020-01-01T00:00:00.000Z');
      const data = {
        helloWorld: 'foo',
        nested: { anotherKey: 'bar' },
        array: [{ elementKey: 'baz' }],
        date,
      };
      const transformed = ResponseTransformer.transformToSnakeCase(data);
      expect(transformed).toEqual({
        hello_world: 'foo',
        nested: { another_key: 'bar' },
        array: [{ element_key: 'baz' }],
        date: '2020-01-01T00:00:00.000Z',
      });
    });
  });
});
