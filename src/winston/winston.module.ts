import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import { Module } from "@nestjs/common";
import { LoggerService } from "./winston.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./winstin.interceptor";
import { NEST_ENV, NestEnvUtil } from "src/configuration";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level:
            NestEnvUtil.getNodeEnv() === NEST_ENV.PRODUCTION ? "info" : "silly",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike("MyApp", {
              prettyPrint: true,
            })
          ),
        }),
      ],
    }),
  ],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
