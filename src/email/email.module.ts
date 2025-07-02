import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import {
  ConfigurationServiceInjector,
  MailConfigService,
  RedisConfigService,
} from "src/configuration";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from "path";
import {
  EachWeekEmailService,
  EmailTestService,
  SignInEmailService,
} from "./providers";
import { EachWeekEmailConsumer, SignInEmailConsumer } from "./consumers";
import { EmailController } from "./email.controller";
import { EmailTestController } from "./email-test.controller";
import { QueueName } from "./constants";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (mailConfig: MailConfigService) => ({
        transport: {
          service: "Naver",
          host: "smtp.naver.com",
          port: 587,
          auth: {
            user: mailConfig.userID,
            pass: mailConfig.userPW,
          },
        },
        // defaults: { // 스팸처리됨
        //   from: '"No Reply" <no-reply@localhost>',
        // },
        defaults: {
          from: `"Wishu" <jimin8830@naver.com>`,
        },
        preview: false,
        template: {
          dir: path.join(process.cwd(), "src", "email", "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigurationServiceInjector.MAIL_SERVICE],
    }),
    // Redis 연결 설정 (BullMQ 전역)
    BullModule.forRootAsync({
      useFactory: (redisConfig: RedisConfigService) => ({
        connection: {
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
        },
      }),
      inject: [ConfigurationServiceInjector.REDIS_SERVICE],
    }),
    BullModule.registerQueue({
      name: QueueName.SIGN_IN_EMAIL,
    }),
    BullModule.registerQueue({
      name: QueueName.EACH_WEEK_EMAIL,
    }),
  ],
  controllers: [EmailController, EmailTestController],
  providers: [
    SignInEmailService,
    EachWeekEmailService,
    SignInEmailConsumer,
    EachWeekEmailConsumer,
    EmailTestService,
  ],
})
export class EmailModule {}
