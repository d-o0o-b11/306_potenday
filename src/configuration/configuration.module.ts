import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import tokenConfig from "./config/token.config";
import mailConfig from "./config/mail.config";
import swaggerConfig from "./config/swagger.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigService } from "./configuration.service";
import { NestEnvUtil } from "./nest-env.util";
import databaseConfig from "./config/database.config";
import kakaoConfig from "./config/kakao.config";
import { ConfigurationName, ConfigurationServiceInjector } from "./common";
import { DatabaseConfig } from "./config";
import { KakaoConfigService } from "./services";

const providers = [
  {
    provide: ConfigurationServiceInjector.KAKAO_SERVICE,
    useClass: KakaoConfigService,
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
  providers: [AppConfigService, ...providers],
  exports: [ConfigurationServiceInjector.KAKAO_SERVICE],
})
export class SettingModule {}
