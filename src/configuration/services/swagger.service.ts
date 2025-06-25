import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get swaggerId(): string {
    return this.configService.getOrThrow<SwaggerConfig>(
      ConfigurationName.SWAGGER
    ).swaggerId;
  }

  get swaggerPw(): string {
    return this.configService.getOrThrow<SwaggerConfig>(
      ConfigurationName.SWAGGER
    ).swaggerPw;
  }
}
