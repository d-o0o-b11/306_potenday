import { IQuery } from "@nestjs/cqrs";

export class InfoQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
