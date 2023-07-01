import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KakaoLoginModule } from "./kakao-oauth/kakao-login.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KakaoUserinfoModule } from "./kakao-userinfo/kakao-userinfo.module";
import { UserFolderModule } from "./user-folder/user-folder.module";
import { UserCardModule } from "./user-card/user-card.module";
import { SendEmailModule } from "./send-email/send-email.module";
import databaseConfig from "./config/database.config";
import kakaoConfig from "./config/kakao.config";
import tokenConfig from "./config/token.config";
import mailConfig from "./config/mail.config";

@Module({
  imports: [
    KakaoLoginModule,
    ConfigModule.forRoot({
      envFilePath: [
        `src/envs/${
          process.env.NODE_ENV == "dev" ? "development" : "production"
        }.env`,
      ],
      load: [databaseConfig, kakaoConfig, tokenConfig, mailConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get("postgres"),
      }),
      inject: [ConfigService],
    }),
    KakaoUserinfoModule,
    UserFolderModule,
    UserCardModule,
    SendEmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
