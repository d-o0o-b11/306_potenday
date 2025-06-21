import { VersioningInitializer } from "../services";
import { INestApplication, VersioningType } from "@nestjs/common";

describe("VersioningInitializer", () => {
  let app: INestApplication;
  let initializer: VersioningInitializer;

  beforeEach(() => {
    app = {
      enableVersioning: jest.fn(),
    } as unknown as INestApplication;

    initializer = new VersioningInitializer();
  });

  it("URI 기반 버전 관리가 활성화되어야 한다.", () => {
    initializer.initialize(app);

    expect(app.enableVersioning).toHaveBeenCalledWith({
      type: VersioningType.URI,
    });
  });
});
