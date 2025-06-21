import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KakaoUserinfoModule } from "./kakao-userinfo/kakao-userinfo.module";
import { UserFolderModule } from "./user-folder/user-folder.module";
import { UserCardModule } from "./user-card/user-card.module";
import { SendEmailModule } from "./send-email/send-email.module";
import { LoggerModule } from "./winston/winston.module";
import { ConfigurationModule } from "./configuration";
import { AuthModule } from "./auth/auth.module";
import { InitializeModule } from "./initialize";

@Module({
  imports: [
    InitializeModule,
    AuthModule,
    ConfigurationModule,
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
