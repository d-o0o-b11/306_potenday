import { Inject, Injectable } from "@nestjs/common";
import configuration from "./swagger.config";
import { ConfigType } from "@nestjs/config";
import { IsAppConfig } from "./swagger.interface";

@Injectable()
export class AppConfigService implements IsAppConfig {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>
  ) {}

  public swagger_id: string;
  public swagger_pw: string;

  get swaggerUsername() {
    const value = this.configService.swagger_id;

    return value;
  }

  get swaggerPassword() {
    const value = this.configService.swagger_pw;

    return value;
  }
}
