import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogoutCommand } from "./logout.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { RefreshToken } from "src/database";

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { userId, sessionId } = command;

    const result = await this.manager.delete(RefreshToken, {
      userId: userId,
      sessionId: sessionId,
    });

    if (!result.affected) {
      throw new Error("Refresh token 삭제 실패했습니다.");
    }
  }
}
