import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor() {
    super({
      clientID: process.env.REST_API,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ["profile_image", "profile_nickname", "account_email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken: accessToken,
      kakao_id: profile._json.id,
      nickname: profile._json.properties.nickname,
      email: profile._json.kakao_account.email,
      profile_image: profile._json.properties.profile_image,
    };
  }
}
