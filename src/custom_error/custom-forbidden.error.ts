import { ForbiddenException } from "@nestjs/common";

export class CustomForbiddenException extends ForbiddenException {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException, 접근 권한이 없습니다.";
  }
}
