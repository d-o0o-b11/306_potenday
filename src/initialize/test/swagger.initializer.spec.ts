import { SwaggerInitializer } from "../services";
import {
  ConfigurationServiceInjector,
  SwaggerConfigService,
} from "src/configuration";
import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";

jest.mock("@nestjs/swagger", () => {
  const mockBuilder = {
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue("build"),
  };

  return {
    DocumentBuilder: jest.fn(() => mockBuilder),
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue("swaggerDoc"),
      setup: jest.fn(),
    },
  };
});

jest.mock("express-basic-auth", () => jest.fn().mockReturnValue("BASIC_AUTH"));

describe("SwaggerInitializer", () => {
  let app: INestApplication;
  let initializer: SwaggerInitializer;
  let configService: SwaggerConfigService;

  beforeEach(() => {
    configService = {
      swaggerId: "admin",
      swaggerPw: "pw1234",
    } as SwaggerConfigService;

    const getMocks = {
      [ConfigurationServiceInjector.SWAGGER_SERVICE]: configService,
    };

    app = {
      get: jest.fn((token) => getMocks[token]),
      use: jest.fn(),
    } as unknown as INestApplication;

    initializer = new SwaggerInitializer();
  });

  it("Swagger와 기본 인증이 정상적으로 설정되어야 한다.", async () => {
    await initializer.initialize(app);

    expect(app.use).toHaveBeenCalledWith("/swagger", "BASIC_AUTH");

    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(app, "build");

    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      "swagger",
      app,
      "swaggerDoc",
      {
        swaggerOptions: {
          tagsSorter: "alpha",
          syntaxHighlight: true,
          persistAuthorization: true,
          displayRequestDuration: true,
          docExpansion: "none",
        },
      }
    );
  });
});
