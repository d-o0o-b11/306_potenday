import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import tokenConfig from "./config/token.config";
import mailConfig from "./config/mail.config";
import swaggerConfig from "./config/swagger.config";
import { NestEnvUtil } from "./utils";
import databaseConfig from "./config/database.config";
import kakaoConfig from "./config/kakao.config";
import { ConfigurationServiceInjector } from "./common";
import {
  KakaoConfigService,
  SwaggerConfigService,
  TokenConfigService,
} from "./services";

const providers = [
  {
    provide: ConfigurationServiceInjector.KAKAO_SERVICE,
    useClass: KakaoConfigService,
  },
  {
    provide: ConfigurationServiceInjector.SWAGGER_SERVICE,
    useClass: SwaggerConfigService,
  },
  {
    provide: ConfigurationServiceInjector.TOKEN_SERVICE,
    useClass: TokenConfigService,
  },
];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`src/envs/${NestEnvUtil.getNodeEnv()}.env`],
      load: [
        databaseConfig,
        kakaoConfig,
        tokenConfig,
        mailConfig,
        swaggerConfig,
      ],
      isGlobal: true,
    }),
  ],
  providers: [...providers],
  exports: [
    ConfigurationServiceInjector.KAKAO_SERVICE,
    ConfigurationServiceInjector.TOKEN_SERVICE,
  ],
})
export class ConfigurationModule {}
