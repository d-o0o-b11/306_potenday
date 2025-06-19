import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KakaoConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class KakaoConfigService {
  constructor(private readonly configService: ConfigService) {}

  getRestAPI(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .rest_api;
  }

  getClientSecret(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .client_secret;
  }

  getCallbackURL(): string {
    return this.configService.getOrThrow<KakaoConfig>(ConfigurationName.KAKAO)
      .redirect_url;
  }
}
