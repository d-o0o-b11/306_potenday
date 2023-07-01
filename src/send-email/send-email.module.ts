import { Module } from "@nestjs/common";
import { SendEmailService } from "./send-email.service";
import { SendEmailController } from "./send-email.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { KakaoUserinfoModule } from "src/kakao-userinfo/kakao-userinfo.module";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: "Naver",
          host: "smtp.naver.com",
          port: 587,
          auth: {
            user: configService.get("mail").user,
            pass: configService.get("mail").pass,
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: false,
        template: {
          dir: process.cwd() + "/template/",
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    KakaoUserinfoModule,
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule {}
