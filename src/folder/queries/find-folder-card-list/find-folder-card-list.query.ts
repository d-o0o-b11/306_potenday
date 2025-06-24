import { IQuery } from "@nestjs/cqrs";

export class FindFolderCardListQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly folderId: string
  ) {}
}
