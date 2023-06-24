import { Module } from "@nestjs/common";
import { KakaoLoginService } from "./kakao-login.service";
import { KakaoLoginController } from "./kakao-login.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtKakaoStrategy } from "./jwt-kakao.strategy";

@Module({
  imports: [PassportModule],
  controllers: [KakaoLoginController],
  providers: [KakaoLoginService, JwtKakaoStrategy],
})
export class KakaoLoginModule {}
