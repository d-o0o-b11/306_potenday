import { Module } from "@nestjs/common";
import { KakaoLoginService } from "./kakao-login.service";
import { KakaoLoginController } from "./kakao-login.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtKakaoStrategy } from "./jwt-kakao.strategy";
import { KakaoUserinfoModule } from "src/kakao-userinfo/kakao-userinfo.module";

@Module({
  imports: [PassportModule, KakaoUserinfoModule],
  controllers: [KakaoLoginController],
  providers: [KakaoLoginService, JwtKakaoStrategy],
})
export class KakaoLoginModule {}
