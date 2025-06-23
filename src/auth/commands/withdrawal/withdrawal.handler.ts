import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WithdrawalCommand } from "./withdrawal.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { User } from "src/database";

@CommandHandler(WithdrawalCommand)
export class WithdrawalCommandHandler
  implements ICommandHandler<WithdrawalCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: WithdrawalCommand): Promise<void> {
    const result = await this.manager.delete(User, {
      id: command.userId,
    });

    if (!result.affected) {
      throw new Error("회원탈퇴 실패했습니다.");
    }
  }
}
