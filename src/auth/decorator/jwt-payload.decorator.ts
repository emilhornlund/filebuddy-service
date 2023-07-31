import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @module
 * Creates a decorator to extract the JWT payload from the request.
 */
export const JwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.jwt;
  },
);
