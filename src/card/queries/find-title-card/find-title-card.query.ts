import { IQuery } from "@nestjs/cqrs";

export class FindTitleCardQuery implements IQuery {
  constructor(public readonly title: string, public readonly userId: string) {}
}
