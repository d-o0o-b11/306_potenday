import { Module } from "@nestjs/common";
import {
  BullBoardInitializer,
  CorsInitializer,
  SwaggerInitializer,
  VersioningInitializer,
} from "./services";

const initializers = [
  CorsInitializer,
  SwaggerInitializer,
  VersioningInitializer,
  BullBoardInitializer,
];

@Module({
  providers: [...initializers],
  exports: [...initializers],
})
export class InitializeModule {}
