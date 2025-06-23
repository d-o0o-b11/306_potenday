import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "../types";

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as UserPayload;
  }
);
