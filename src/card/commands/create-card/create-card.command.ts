import { ICommand } from "@nestjs/cqrs";

export class CreateCardCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly context: string,
    public readonly top: number,
    public readonly left: number,
    public readonly folderId: string,
    public readonly userId: string
  ) {}
}
