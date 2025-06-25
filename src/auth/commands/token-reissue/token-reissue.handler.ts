import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TokenReissueCommand } from "./token-reissue.command";
import { EntityManager } from "typeorm";
import { RefreshToken } from "src/database";
import { JwtManagerService } from "src/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { RefreshTokenMapper } from "src/auth/mappers";

@CommandHandler(TokenReissueCommand)
export class TokenReissueCommandHandler
  implements ICommandHandler<TokenReissueCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    private readonly jwtManager: JwtManagerService
  ) {}

  async execute(command: TokenReissueCommand) {
    const { userId, sessionId } = command;

    const findRT = await this.manager.findOne(RefreshToken, {
      where: {
        userId,
        sessionId,
      },
    });

    if (!findRT) {
      throw new Error("Refresh token이 존재하지 않습니다.");
    }

    const domain = RefreshTokenMapper.toDomain(findRT);

    const isValid = await this.jwtManager.verifyRefreshToken(
      domain.getProps().token
    );

    if (!isValid) {
      throw new Error("유효하지 않은 Refresh token입니다.");
    }

    return { AT: await this.jwtManager.generateAccessToken(userId, sessionId) };
  }
}
