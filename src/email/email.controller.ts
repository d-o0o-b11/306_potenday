import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { EachWeekEmailService, SignInEmailService } from "./providers";

@ApiTags("Email")
@Controller({ path: "email", version: "1" })
export class EmailController {
  constructor(
    private readonly signInEmailService: SignInEmailService,
    private readonly eachWeekEmailService: EachWeekEmailService
  ) {}

  @Post("sign-in")
  @ApiOperation({
    summary: "회원가입 후 다음날 아침 10시에 발송되는 이메일",
  })
  async signIn() {
    return await this.signInEmailService.sendEmailJob();
  }

  @Post("each-week")
  @ApiOperation({
    summary: "매주 월요일 아침 10시에 발송되는 이메일",
  })
  async eachWeek() {
    return await this.eachWeekEmailService.sendEmailJob();
  }
}
