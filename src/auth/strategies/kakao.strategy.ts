import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import {
  ConfigurationServiceInjector,
  KakaoConfigService,
} from "src/configuration";
import { PassportStrategyName } from "../common";

@Injectable()
export class KakaoStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.KAKAO
) {
  constructor(
    @Inject(ConfigurationServiceInjector.KAKAO_SERVICE)
    private readonly kakaoConfigService: KakaoConfigService
  ) {
    super({
      clientID: kakaoConfigService.restAPI,
      clientSecret: kakaoConfigService.clientSecret,
      callbackURL: kakaoConfigService.callbackURL,
      scope: ["profile_image", "profile_nickname", "account_email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      externalId: profile._json.id,
      name: profile._json.properties.nickname,
      profile: profile._json.properties.profile_image,
      email: profile._json.kakao_account.email,
    };
  }
}
