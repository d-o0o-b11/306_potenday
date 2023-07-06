import { UnauthorizedException } from "@nestjs/common";

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException, 접근 권한이 없습니다.";
  }
}
