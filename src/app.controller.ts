import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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
}
