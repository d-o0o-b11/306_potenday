import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SocialPayload } from "../interfaces";

export const Social = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SocialPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as SocialPayload;
  }
);
