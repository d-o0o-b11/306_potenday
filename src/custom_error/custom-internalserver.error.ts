import { InternalServerErrorException } from "@nestjs/common";

export class CustomInternalServerErrorException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
    this.name = "서버 오류가 발생했습니다.";
  }
}
