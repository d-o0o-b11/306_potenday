import { Controller, Get, NotFoundException } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomNotFoundError } from "./custom_error/custom-notfound.error";

@ApiTags("연결 상태 확인 API")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary:
      "처음 연결하실 때 요청 한 번 보내보세요!! Hello World 떠야지 서버 연결 성공입니다.",
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("test")
  @ApiOperation({
    summary: "에러 확인",
  })
  async test() {
    try {
      return await this.appService.test();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new CustomNotFoundError(e.message);
      }
    }
  }
}
