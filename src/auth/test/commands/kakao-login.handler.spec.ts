import { EntityManager } from "typeorm";
import {
  ConfigurationServiceInjector,
  TokenConfigService,
} from "src/configuration";
import { User } from "src/user";
import { KaKaoLoginCommand, KaKaoLoginCommandHandler } from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import {
  AuthSocial as AuthSocialEntity,
  RefreshToken as RefreshTokenEntity,
  User as UserEntity,
  MockEntityManager,
} from "src/database";
import { AuthSocial, RefreshToken, SocialCodeVO } from "../../domain";
import { CreateDefaultFolderEvent, JwtManagerService } from "src/common";
import { EventBus } from "@nestjs/cqrs";

describe("KaKaoLoginCommandHandler", () => {
  let handler: KaKaoLoginCommandHandler;
  let manager: EntityManager;
  let jwtManager: JwtManagerService;
  let tokenConfig: TokenConfigService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KaKaoLoginCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
        {
          provide: JwtManagerService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          },
        },
        {
          provide: ConfigurationServiceInjector.TOKEN_SERVICE,
          useValue: {
            refreshTokenExpiresIn: "7d",
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<KaKaoLoginCommandHandler>(KaKaoLoginCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
    jwtManager = module.get<JwtManagerService>(JwtManagerService);
    tokenConfig = module.get<TokenConfigService>(
      ConfigurationServiceInjector.TOKEN_SERVICE
    );
    eventBus = module.get<EventBus>(EventBus);
  });

  const command = new KaKaoLoginCommand(
    "userExistId",
    "d_o0o_b",
    "http://profile.image",
    "d_o0o_b@gmail.com"
  );

  describe("execute", () => {
    it("기존 유저가 존재하면 유저를 생성하지 않는다", async () => {
      const existingUser = { userId: "existing-user-id" };

      jest.spyOn(manager, "findOne").mockResolvedValue(existingUser);

      jest.spyOn(RefreshToken, "create").mockReturnValue({
        id: { unpack: () => "refresh-token-id" },
        getProps: () => ({
          userId: { unpack: () => "existing-user-id" },
          sessionId: { unpack: () => "session-id" },
        }),
      } as any);

      const insert = jest.spyOn(manager, "insert");

      jest
        .spyOn(jwtManager, "generateAccessToken")
        .mockResolvedValue("ACCESS_TOKEN");
      jest
        .spyOn(jwtManager, "generateRefreshToken")
        .mockResolvedValue("REFRESH_TOKEN");

      const result = await handler.execute(command);

      expect(result).toEqual({ AT: "ACCESS_TOKEN", RT: "REFRESH_TOKEN" });

      expect(manager.findOne).toHaveBeenCalledWith(AuthSocialEntity, {
        where: {
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO.value,
        },
      });

      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith(
        RefreshTokenEntity,
        expect.objectContaining({
          userId: "existing-user-id",
          sessionId: "session-id",
        })
      );

      expect(jwtManager.generateAccessToken).toHaveBeenCalledWith(
        "existing-user-id",
        expect.any(String)
      );
      expect(jwtManager.generateRefreshToken).toHaveBeenCalledWith(
        "existing-user-id"
      );

      expect(eventBus.publish).not.toHaveBeenCalled(); // 이벤트 호출 X
    });

    it("유저가 존재하지 않으면 새 유저와 소셜 계정을 생성한다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValue(null);

      jest.spyOn(User, "create").mockReturnValue({
        id: { unpack: () => "user-id" },
        getProps: () => ({
          userId: { unpack: () => "user-id" },
        }),
      } as any);

      jest.spyOn(AuthSocial, "create").mockReturnValue({
        id: { unpack: () => "social-id" },
        getProps: () => ({
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO,
          userId: { unpack: () => "user-id" },
        }),
      } as any);

      jest.spyOn(RefreshToken, "create").mockReturnValue({
        id: { unpack: () => "refresh-id" },
        getProps: () => ({
          userId: { unpack: () => "user-id" },
          sessionId: { unpack: () => "session-id" },
        }),
      } as any);

      const insert = jest.spyOn(manager, "insert");

      jest
        .spyOn(jwtManager, "generateAccessToken")
        .mockResolvedValue("ACCESS_TOKEN");
      jest
        .spyOn(jwtManager, "generateRefreshToken")
        .mockResolvedValue("REFRESH_TOKEN");

      const result = await handler.execute(command);

      expect(manager.findOne).toHaveBeenCalledWith(AuthSocialEntity, {
        where: {
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO.value,
        },
      });

      expect(insert).toHaveBeenCalledTimes(3);

      expect(insert).toHaveBeenNthCalledWith(
        1,
        UserEntity,
        expect.objectContaining({
          id: "user-id",
        })
      );

      expect(insert).toHaveBeenNthCalledWith(
        2,
        AuthSocialEntity,
        expect.objectContaining({
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO.value,
          userId: "user-id",
        })
      );

      expect(insert).toHaveBeenNthCalledWith(
        3,
        RefreshTokenEntity,
        expect.objectContaining({
          userId: "user-id",
          sessionId: "session-id",
        })
      );

      expect(jwtManager.generateAccessToken).toHaveBeenCalledWith(
        "user-id",
        expect.any(String)
      );
      expect(jwtManager.generateRefreshToken).toHaveBeenCalledWith("user-id");

      expect(eventBus.publish).toHaveBeenCalledTimes(1); // 기본 폴더 생성 이벤트 발행
      expect(eventBus.publish).toHaveBeenCalledWith(
        CreateDefaultFolderEvent.from({ userId: "user-id" })
      );

      expect(result).toEqual({ AT: "ACCESS_TOKEN", RT: "REFRESH_TOKEN" });
    });
  });
});
