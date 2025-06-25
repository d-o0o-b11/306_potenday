import { IQuery } from "@nestjs/cqrs";

export class FindCardQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
