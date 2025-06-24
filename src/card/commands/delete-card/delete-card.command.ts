import { ICommand } from "@nestjs/cqrs";

export class DeleteCardCommand implements ICommand {
  constructor(public readonly cardId: string, public readonly userId: string) {}
}
