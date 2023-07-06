import { NotFoundException } from "@nestjs/common";

export class CustomNotFoundError extends NotFoundException {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError, 리소스를 찾을 수 없습니다.";
  }
}
