import { IQuery } from "@nestjs/cqrs";

export class FindFolderQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
