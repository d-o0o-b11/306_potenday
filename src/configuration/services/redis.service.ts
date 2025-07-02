import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.getOrThrow<RedisConfig>(ConfigurationName.REDIS)
      .host;
  }

  get port(): number {
    return this.configService.getOrThrow<RedisConfig>(ConfigurationName.REDIS)
      .port;
  }

  get password(): string {
    return this.configService.getOrThrow<RedisConfig>(ConfigurationName.REDIS)
      .password;
  }
}
