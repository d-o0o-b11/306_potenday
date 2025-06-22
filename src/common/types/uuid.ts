import { isUUID } from "class-validator";
import { randomUUID } from "crypto";
import { ID } from "../id";

export class UUID extends ID<string> {
  static create(value?: string): UUID {
    if (value) {
      return new UUID(value);
    }
    return new UUID(randomUUID());
  }

  public equals(id: ID<unknown>): boolean {
    if (!(id instanceof UUID)) {
      return false;
    }

    return id.value === this.value;
  }

  public validate() {
    if (!isUUID(this.value)) {
      throw new Error("Invalid Domain UUID");
    }
  }
}
