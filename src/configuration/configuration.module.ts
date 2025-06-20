import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import tokenConfig from "./config/token.config";
import mailConfig from "./config/mail.config";
import swaggerConfig from "./config/swagger.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestEnvUtil } from "./utils";
import databaseConfig from "./config/database.config";
import kakaoConfig from "./config/kakao.config";
import { ConfigurationName, ConfigurationServiceInjector } from "./common";
import { DatabaseConfig } from "./config";
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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DatabaseConfig>(
          ConfigurationName.DATABASE
        );

        return {
          ...dbConfig,
          type: "postgres",
        };
      },
    }),
  ],
  providers: [...providers],
  exports: [
    ConfigurationServiceInjector.KAKAO_SERVICE,
    ConfigurationServiceInjector.TOKEN_SERVICE,
  ],
})
export class ConfigurationModule {}
