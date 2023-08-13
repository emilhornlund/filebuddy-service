import { Transform } from 'class-transformer';

export const TransformIntProperty = (): PropertyDecorator =>
  Transform(({ value }) => parseInt(value, 10));
