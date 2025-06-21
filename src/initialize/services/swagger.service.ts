import { AppInitializer } from "../abstract";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as expressBasicAuth from "express-basic-auth";
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
        { type: "http", scheme: "bearer", name: "JWT", in: "header" },
        "access-token"
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
