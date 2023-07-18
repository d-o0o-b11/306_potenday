import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import { AppConfigService } from "./configuration.service";
import * as expressBasicAuth from "express-basic-auth";
import { NestExpressApplication } from "@nestjs/platform-express";

export class SetUpConfig {
  constructor(private readonly app: NestExpressApplication) {}

  async setUp() {
    this.swaggerConfig();
    this.setCORS();
  }

  async setListen(port: number) {
    await this.app.listen(port);
  }

  /**
   * 사이트 접근하기 전 인증 로직
   * @param url swagger, bull-board url
   */
  protected setUrlLogin(url: string) {
    const configService: AppConfigService =
      this.app.get<AppConfigService>(AppConfigService);

    const username = configService.swaggerUsername;
    const pw = configService.swaggerPassword;

    const users: { [key: string]: string } = {};
    users[username] = pw;

    this.app.use(
      [`${url}`],
      expressBasicAuth({
        challenge: true,
        users: users,
      })
    );
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

    /**
     * @memo
     * swagger 앞에 / 유무로 인해 기능이 실행됨
     * 무조건 추가!!
     */
    this.setUrlLogin("/swagger/potenday306");

    SwaggerModule.setup(
      "swagger/potenday306",
      this.app,
      document,
      swaggerOptions
    );
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
      allowedHeaders: "Content-Type, Accept, Authorization",
    });
  }
}
