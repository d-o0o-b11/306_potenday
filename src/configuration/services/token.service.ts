import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class TokenConfigService {
  constructor(private readonly configService: ConfigService) {}

  get accessTokenSecret(): string {
    return this.configService.getOrThrow<TokenConfig>(ConfigurationName.TOKEN)
      .jwtAccessSecret;
  }

  get accessTokenExpiresIn(): string {
    return this.configService.getOrThrow<TokenConfig>(ConfigurationName.TOKEN)
      .jwtAccessExpirationTime;
  }

  get refreshTokenSecret(): string {
    return this.configService.getOrThrow<TokenConfig>(ConfigurationName.TOKEN)
      .jwtRefreshSecret;
  }

  get refreshTokenExpiresIn(): string {
    return this.configService.getOrThrow<TokenConfig>(ConfigurationName.TOKEN)
      .jwtRefreshExpirationTime;
  }
}
