import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
      .setVersion("1.0.0")
      .addTag("swagger")
      .addServer("http://localhost:3000")
      .build();
    const document = SwaggerModule.createDocument(this.app, config);

    SwaggerModule.setup("swagger", this.app, document);
  }

  protected setCORS() {
    this.app.enableCors({
      origin: "http://localhost:3000",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      allowedHeaders: "*",
    });
  }
}
