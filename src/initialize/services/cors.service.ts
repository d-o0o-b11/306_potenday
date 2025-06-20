import { AppInitializer } from "../abstract";
import { INestApplication } from "@nestjs/common";

export class CorsInitializer extends AppInitializer {
  initialize(app: INestApplication) {
    app.enableCors({
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
      credentials: true,
      allowedHeaders: "Content-Type, Accept, Authorization",
    });
  }
}
