import { ForbiddenException } from "@nestjs/common";

export class CustomForbiddenException extends ForbiddenException {
  constructor(message?: string) {
    super(message || "만료된 토큰입니다.");
  }
}
