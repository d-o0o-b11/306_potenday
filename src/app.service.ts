import { Injectable } from "@nestjs/common";
import { CustomNotFoundError } from "./custom_error/custom-notfound.error";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World! CI/CD 구축 성공!";
  }

  async test() {
    throw new CustomNotFoundError("확인");
  }
}
