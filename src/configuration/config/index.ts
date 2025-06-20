import { ConfigType } from "@nestjs/config";
import databaseConfig from "./database.config";
import kakaoConfig from "./kakao.config";
import mailConfig from "./mail.config";
import tokenConfig from "./token.config";
import swaggerConfig from "./swagger.config";

export * from "./database.config";
export * from "./kakao.config";
export * from "./mail.config";
export * from "./swagger.config";
export * from "./token.config";

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
export type KakaoConfig = ConfigType<typeof kakaoConfig>;
export type TokenConfig = ConfigType<typeof tokenConfig>;
export type MailConfig = ConfigType<typeof mailConfig>;
export type SwaggerConfig = ConfigType<typeof swaggerConfig>;
