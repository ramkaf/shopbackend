import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserContext(context),
);

export const getCurrentUserContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};
