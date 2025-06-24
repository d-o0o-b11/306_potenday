import { Module } from "@nestjs/common";
import { SendEmailModule } from "./send-email/send-email.module";
import { LoggerModule } from "./winston/winston.module";
import { ConfigurationModule } from "./configuration";
import { AuthModule } from "./auth/auth.module";
import { InitializeModule } from "./initialize";
import { CommonModule } from "./common";
import { UserModule } from "./user";
import { FolderModule } from "./folder";
import { CardModule } from "./card";
import { DatabaseModule } from "./database";

@Module({
  imports: [
    InitializeModule,
    DatabaseModule,
    CommonModule,
    ConfigurationModule,
    AuthModule,
    UserModule,
    FolderModule,
    CardModule,

    SendEmailModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
