import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KakaoUserInfoEntity } from "./kakao-userinfo/entities/kakao-userinfo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([KakaoUserInfoEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
