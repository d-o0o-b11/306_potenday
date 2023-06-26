import { Module } from "@nestjs/common";
import { KakaoUserinfoService } from "./kakao-userinfo.service";
import { KakaoUserinfoController } from "./kakao-userinfo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KakaoUserInfoEntity } from "./entities/kakao-userinfo.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([KakaoUserInfoEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: "myaccesssecretkey",
        signOptions: {
          expiresIn: 20000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [KakaoUserinfoController],
  providers: [KakaoUserinfoService],
  exports: [KakaoUserinfoService],
})
export class KakaoUserinfoModule {}
