import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOption } from "./data-sources";
import { NEST_ENV, NestEnvUtil } from "src/configuration";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOption,
      logging: NestEnvUtil.getNodeEnv() === NEST_ENV.DEV ? "all" : undefined,
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
