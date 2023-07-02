import { INestApplication } from "@nestjs/common";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";

export class SetUpConfig {
  constructor(private readonly app: INestApplication) {}

  async setUp() {
    this.swaggerConfig();
    this.setCORS();
  }

  async setListen(port: number) {
    await this.app.listen(port);
  }

  protected swaggerConfig() {
    const config = new DocumentBuilder()
      .setTitle("POTEN_DAY SWAGGER")
      .setDescription("poten day API description")
      .setVersion("3.0.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          name: "JWT",
          in: "header",
        },
        "access-token"
      )
      .build();

    const swaggerOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        tagsSorter: "alpha",
        syntaxHighlight: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
      },
    };

    const document = SwaggerModule.createDocument(this.app, config);

    SwaggerModule.setup("swagger", this.app, document, swaggerOptions);
  }

  protected setCORS() {
    this.app.enableCors({
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
      allowedHeaders: "*",
    });
  }
}
