import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KakaoLoginModule } from "./kakao-login/kakao-login.module";

@Module({
  imports: [KakaoLoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
