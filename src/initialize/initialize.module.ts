import { Module } from "@nestjs/common";
import {
  CorsInitializer,
  SwaggerInitializer,
  VersioningInitializer,
} from "./services";

const initializers = [
  CorsInitializer,
  SwaggerInitializer,
  VersioningInitializer,
];

@Module({
  providers: [...initializers],
  exports: [...initializers],
})
export class InitializeModule {}
