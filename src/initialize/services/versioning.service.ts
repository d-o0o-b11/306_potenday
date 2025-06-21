import { AppInitializer } from "../abstract";
import { INestApplication, VersioningType } from "@nestjs/common";

export class VersioningInitializer extends AppInitializer {
  initialize(app: INestApplication) {
    app.enableVersioning({
      type: VersioningType.URI,
    });
  }
}
