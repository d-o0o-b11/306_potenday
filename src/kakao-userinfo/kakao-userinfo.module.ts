import { Module } from '@nestjs/common';
import { KakaoUserinfoService } from './kakao-userinfo.service';
import { KakaoUserinfoController } from './kakao-userinfo.controller';

@Module({
  controllers: [KakaoUserinfoController],
  providers: [KakaoUserinfoService]
})
export class KakaoUserinfoModule {}
