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
import { CqrsModule } from "@nestjs/cqrs";
import { CommonModule } from "./common";
import { UserModule } from "./user";
import { FolderModule } from "./folder";

@Module({
  imports: [
    InitializeModule,
    CqrsModule,
    CommonModule,
    ConfigurationModule,
    AuthModule,
    UserModule,
    FolderModule,

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
