import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { EmailTestService } from "./providers";

@ApiTags("Test")
@Controller({ path: "email/test", version: "1" })
export class EmailTestController {
  constructor(private readonly service: EmailTestService) {}

  @Post("sign-in")
  @ApiOperation({
    summary: "회원가입 후 테스트용 이메일 발송",
  })
  async test() {
    return await this.service.signInTest();
  }

  @Post("each-week")
  @ApiOperation({
    summary: "매주 월요일 테스트용 이메일 발송",
  })
  async eachWeek() {
    return await this.service.eachWeekTest();
  }
}
