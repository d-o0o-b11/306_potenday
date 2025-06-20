import { INestApplication } from "@nestjs/common";
import { CorsInitializer } from "../services";

describe("CorsInitializer", () => {
  let app: INestApplication;
  let initializer: CorsInitializer;

  beforeEach(() => {
    app = {
      enableCors: jest.fn(),
    } as unknown as INestApplication;

    initializer = new CorsInitializer();
  });

  it("허용하고자 하는 origin에 대해 CORS가 적용되어야 한다.", () => {
    initializer.initialize(app);

    expect(app.enableCors).toHaveBeenCalledWith({
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
  });
});
