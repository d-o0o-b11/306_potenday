import { AppInitializer } from "../abstract";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as expressBasicAuth from "express-basic-auth";
import { SwaggerAuth } from "src/common";
import {
  ConfigurationServiceInjector,
  SwaggerConfigService,
} from "src/configuration";

export class SwaggerInitializer extends AppInitializer {
  async initialize(app: INestApplication) {
    const swaggerService = app.get<SwaggerConfigService>(
      ConfigurationServiceInjector.SWAGGER_SERVICE
    );

    const config = new DocumentBuilder()
      .setTitle("POTEN_DAY SWAGGER")
      .setDescription("poten day API description")
      .setVersion("3.0.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Bearer",
          description: "JWT Access Token을 헤더에 넣어 요청하세요.",
        },
        SwaggerAuth.AUTH_AT
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const users = { [swaggerService.swaggerId]: swaggerService.swaggerPw };
    app.use("/swagger", expressBasicAuth({ challenge: true, users }));

    SwaggerModule.setup("swagger", app, document, {
      swaggerOptions: {
        tagsSorter: "alpha",
        syntaxHighlight: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
      },
    });
  }
}
