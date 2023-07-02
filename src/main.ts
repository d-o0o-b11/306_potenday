import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SetUpConfig } from "./setup.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { corsMiddleware } from "./user-folder/cors-middleware";
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(corsMiddleware)

  const configService = new SetUpConfig(app);
  await configService.setUp();
  await configService.setListen(3000);
}
bootstrap();
