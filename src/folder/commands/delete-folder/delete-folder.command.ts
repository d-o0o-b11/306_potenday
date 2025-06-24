import { ICommand } from "@nestjs/cqrs";

export class DeleteFolderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly folderId: string
  ) {}
}
