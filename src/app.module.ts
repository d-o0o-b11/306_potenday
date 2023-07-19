import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KakaoLoginModule } from "./kakao-oauth/kakao-login.module";
import { KakaoUserinfoModule } from "./kakao-userinfo/kakao-userinfo.module";
import { UserFolderModule } from "./user-folder/user-folder.module";
import { UserCardModule } from "./user-card/user-card.module";
import { SendEmailModule } from "./send-email/send-email.module";
import { LoggerModule } from "./winston/winston.module";
import { SettingModule } from "./config/config.module";

@Module({
  imports: [
    KakaoLoginModule,
    SettingModule,
    KakaoUserinfoModule,
    UserFolderModule,
    UserCardModule,
    SendEmailModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
