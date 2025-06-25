import { ICommand } from "@nestjs/cqrs";

export class CreateFolderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly widthName: string,
    public readonly heightName: string
  ) {}
}
