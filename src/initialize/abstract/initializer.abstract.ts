import { INestApplication } from "@nestjs/common";

export abstract class AppInitializer {
  abstract initialize(app: INestApplication): Promise<void> | void;
}
