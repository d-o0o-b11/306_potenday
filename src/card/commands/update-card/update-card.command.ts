import { ICommand } from "@nestjs/cqrs";

export class UpdateCardCommand implements ICommand {
  constructor(
    public readonly cardId: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly context?: string,
    public readonly top?: number,
    public readonly left?: number,
    public readonly foldedState?: boolean
  ) {}
}
