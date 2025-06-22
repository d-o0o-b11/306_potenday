import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenDecodePayload } from "src/common";
import {
  ConfigurationServiceInjector,
  TokenConfigService,
} from "src/configuration";

@Injectable()
export class JwtManagerService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(ConfigurationServiceInjector.TOKEN_SERVICE)
    private readonly tokenConfig: TokenConfigService
  ) {}

  async generateAccessToken(
    userId: string,
    sessionId: string
  ): Promise<string> {
    return this.jwtService.signAsync(
      { userId, sessionId },
      {
        secret: this.tokenConfig.accessTokenSecret,
        expiresIn: this.tokenConfig.accessTokenExpiresIn,
      }
    );
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.tokenConfig.refreshTokenSecret,
        expiresIn: this.tokenConfig.refreshTokenExpiresIn,
      }
    );
  }

  async verifyAccessToken(
    token: string
  ): Promise<{ userId: string; sessionId: string }> {
    return this.jwtService.verifyAsync(token, {
      secret: this.tokenConfig.accessTokenSecret,
    });
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    return this.jwtService.verifyAsync(token, {
      secret: this.tokenConfig.refreshTokenSecret,
    });
  }

  async decodeAccessToken(
    token: string
  ): Promise<AccessTokenDecodePayload | null> {
    return this.jwtService.decode(token) as AccessTokenDecodePayload | null;
  }
}
