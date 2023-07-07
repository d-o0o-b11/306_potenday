import { Module } from "@nestjs/common";
import { KakaoUserinfoService } from "./kakao-userinfo.service";
import { KakaoUserinfoController } from "./kakao-userinfo.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EntitiesModule } from "src/entity.module";
import { USER_KAKAO_LOGIN_TOKEN } from "./interface/kakao-login.interface";
@Module({
  imports: [
    EntitiesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: {
          expiresIn: 3600000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [KakaoUserinfoController],
  providers: [
    JwtService,
    {
      provide: USER_KAKAO_LOGIN_TOKEN,
      useClass: KakaoUserinfoService,
    },
  ],
  exports: [JwtModule, USER_KAKAO_LOGIN_TOKEN],
})
export class KakaoUserinfoModule {}
