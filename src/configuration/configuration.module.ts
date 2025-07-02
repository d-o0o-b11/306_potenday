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
  MailConfigService,
  RedisConfigService,
  SwaggerConfigService,
  TokenConfigService,
} from "./services";
import redisConfig from "./config/redis.config";

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
  {
    provide: ConfigurationServiceInjector.REDIS_SERVICE,
    useClass: RedisConfigService,
  },
  {
    provide: ConfigurationServiceInjector.MAIL_SERVICE,
    useClass: MailConfigService,
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
        redisConfig,
      ],
      isGlobal: true,
    }),
  ],
  providers: [...providers],
  exports: [
    ConfigurationServiceInjector.KAKAO_SERVICE,
    ConfigurationServiceInjector.TOKEN_SERVICE,
    ConfigurationServiceInjector.REDIS_SERVICE,
    ConfigurationServiceInjector.MAIL_SERVICE,
  ],
})
export class ConfigurationModule {}
