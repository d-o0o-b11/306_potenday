import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import {
  AppInitializer,
  CorsInitializer,
  SwaggerInitializer,
  VersioningInitializer,
} from "./initialize";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const initializers: AppInitializer[] = [
    app.get(VersioningInitializer),
    app.get(SwaggerInitializer),
    app.get(CorsInitializer),
  ];

  for (const initializer of initializers) {
    await initializer.initialize(app);
  }

  await app.listen(3000);

  Logger.log(
    `Nest.js is running on Port [${3000}], using ENV mode [${
      process.env.NODE_ENV
    }]`
  );
}
bootstrap();
