import { ICommand } from "@nestjs/cqrs";

export class TokenReissueCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly sessionId: string
  ) {}
}
