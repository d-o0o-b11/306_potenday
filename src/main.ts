import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SetUpConfig } from "./setup.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { corsMiddleware } from "./user-folder/cors-middleware";
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(corsMiddleware)
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://accounts.kakao.com",
        "https://kauth.kakao.com",
        "https://potenday-project.github.io",
        "https://potenday-project.github.io/Wishu/",
        "https://potenday-project.github.io/Wishu",
        "https://potenday-project.github.io/Wishu/*",
      ],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: "Content-Type, Accept, Authorization",
      credentials: true,
    })
  );

  const configService = new SetUpConfig(app);
  await configService.setUp();
  await configService.setListen(3000);
}
bootstrap();
