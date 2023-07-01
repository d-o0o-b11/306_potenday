import { Controller, Get } from "@nestjs/common";
import { SendEmailService } from "./send-email.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("이메일 API")
@Controller("send-email")
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Get()
  @ApiOperation({
    summary: "이메일 전송 테스트 << 개발 확인용 API >>",
  })
  async senMailTest() {
    return await this.sendEmailService.sendMail();
  }
}
