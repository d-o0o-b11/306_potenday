import { ICommand } from "@nestjs/cqrs";

export class KaKaoLoginCommand implements ICommand {
  constructor(
    public readonly externalId: string,
    public readonly name: string,
    public readonly profile: string,
    public readonly email: string
  ) {}
}
