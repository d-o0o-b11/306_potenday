import { Module } from "@nestjs/common";
import { SendEmailService } from "./send-email.service";
import { MailModule } from "src/maill.module";

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [SendEmailService],
})
export class SendEmailModule {}
