import { ICommand } from "@nestjs/cqrs";

export class UpdateStatusCardCommand implements ICommand {
  constructor(
    public readonly cardId: string,
    public readonly userId: string,
    public readonly status: boolean
  ) {}
}
