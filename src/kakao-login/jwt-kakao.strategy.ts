import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor() {
    console.log("JwtKakaoStrategy 생성자 호출됨");
    super({
      clientID: "2a454928d20431c58b2e9e199c9cf847",
      clientSecret: "OT2JzWylPCaajR8PMAv896NSRwRnWxju",
      callbackURL: "http://localhost:3000/kakao-login/kakao-callback",
      scope: ["profile_image", "profile_nickname", "account_email"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("accessToken" + accessToken);
    console.log("refreshToken" + refreshToken);
    console.log(profile);
    //profile.username , profile._raw.profile_image ,

    console.log("email", profile._json.kakao_account.email);

    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: profile.id,
    };
  }
}
