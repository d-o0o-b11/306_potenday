import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KakaoConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class KakaoConfigService {
  constructor(private readonly configService: ConfigService) {}

  get restAPI(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .restAPI;
  }

  get clientSecret(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .clientSecret;
  }

  get callbackURL(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .redirectUrl;
  }
}
