import { ICommand } from "@nestjs/cqrs";

export class UpdateInfoCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly emailActive?: boolean
  ) {}
}
