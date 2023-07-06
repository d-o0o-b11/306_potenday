import { Module } from "@nestjs/common";
import { SendEmailService } from "./send-email.service";
import { SendEmailController } from "./send-email.controller";
import { KakaoUserinfoModule } from "src/kakao-userinfo/kakao-userinfo.module";
import { MailModule } from "src/maill.module";

@Module({
  imports: [MailModule, KakaoUserinfoModule],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule {}
