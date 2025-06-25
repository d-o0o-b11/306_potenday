import { ICommand } from "@nestjs/cqrs";

export class UpdateFolderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly folderId: string,
    public readonly name?: string,
    public readonly widthName?: string,
    public readonly heightName?: string
  ) {}
}
