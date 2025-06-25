import { DataSource, DataSourceOptions } from "typeorm";
import { config as configDotenv } from "dotenv";
import databaseConfig from "src/configuration/config/database.config";
import { IsDatabaseConfig } from "src/configuration";
import * as path from "path";

configDotenv({
  path: `envs/${process.env.NODE_ENV}.env`,
});

const config: IsDatabaseConfig = databaseConfig();

export const dataSourceOption: DataSourceOptions = {
  type: "postgres",
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  dropSchema: false,
  synchronize: false,
  // entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
  entities: [path.join(__dirname, "../../**/*.entity{.ts,.js}")],
  // migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
  migrations: [path.join(__dirname, "../migrations/**/*{.ts,.js}")],
  migrationsTableName: "migrations",
};

export const dataSource = new DataSource(dataSourceOption);
