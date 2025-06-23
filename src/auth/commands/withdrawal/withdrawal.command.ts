import { ICommand } from "@nestjs/cqrs";

export class WithdrawalCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
