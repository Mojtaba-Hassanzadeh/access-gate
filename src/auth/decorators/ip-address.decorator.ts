import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetIP = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.header('x-forwarded-for') || request.connection.remoteAddress
    );
  },
);
