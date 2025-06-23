import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { KaKaoLoginCommand } from "./kakao-login.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import {
  User as UserEntity,
  AuthSocial as AuthSocialEntity,
  RefreshToken as RefreshTokenEntity,
} from "src/database";
import { AuthSocial, RefreshToken, SocialCodeVO } from "../../domain";
import {
  ConfigurationServiceInjector,
  TokenConfigService,
} from "src/configuration";
import { User, UserMapper } from "src/user";
import { AuthSocialMapper, RefreshTokenMapper } from "../../mappers";
import { JwtManagerService, UUID } from "src/common";
import { Inject } from "@nestjs/common";
import { randomUUID } from "crypto";

@CommandHandler(KaKaoLoginCommand)
export class KaKaoLoginCommandHandler
  implements ICommandHandler<KaKaoLoginCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    private readonly jwtManager: JwtManagerService,
    @Inject(ConfigurationServiceInjector.TOKEN_SERVICE)
    private readonly tokenConfig: TokenConfigService
  ) {}

  async execute(command: KaKaoLoginCommand) {
    const { externalId, name, profile, email } = command;

    const userId = await this.findOrCreateUser(
      externalId,
      name,
      profile,
      email
    );
    const sessionId = randomUUID();

    const AT = await this.jwtManager.generateAccessToken(userId, sessionId);
    const RT = await this.jwtManager.generateRefreshToken(userId);

    await this.manager.insert(
      RefreshTokenEntity,
      RefreshTokenMapper.toPersistence(
        RefreshToken.create({
          userId: userId,
          token: RT,
          sessionId,
          expiredAt: this.tokenConfig.refreshTokenExpiresIn,
        })
      )
    );

    return { AT, RT };
  }

  private async findOrCreateUser(
    externalId: string,
    name: string,
    profile: string,
    email: string
  ): Promise<string> {
    const existing = await this.manager.findOne(AuthSocialEntity, {
      where: {
        externalId,
        socialCode: SocialCodeVO.KAKAO.value,
      },
    });

    if (existing) return existing.userId;

    const newUser = User.create({ name, profile, email });
    await this.manager.insert(UserEntity, UserMapper.toPersistence(newUser));

    await this.manager.insert(
      AuthSocialEntity,
      AuthSocialMapper.toPersistence(
        AuthSocial.create({
          externalId,
          socialCode: SocialCodeVO.KAKAO,
          userId: newUser.id.unpack(),
        })
      )
    );

    return newUser.id.unpack();
  }
}
