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
import { JwtManagerService } from "src/common";

describe("KaKaoLoginCommandHandler", () => {
  let handler: KaKaoLoginCommandHandler;
  let manager: EntityManager;
  let jwtManager: JwtManagerService;
  let tokenConfig: TokenConfigService;

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
      ],
    }).compile();

    handler = module.get<KaKaoLoginCommandHandler>(KaKaoLoginCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
    jwtManager = module.get<JwtManagerService>(JwtManagerService);
    tokenConfig = module.get<TokenConfigService>(
      ConfigurationServiceInjector.TOKEN_SERVICE
    );
  });

  const command = new KaKaoLoginCommand(
    "userExistId",
    "d_o0o_b",
    "http://profile.image",
    "d_o0o_b@gmail.com"
  );

  describe("execute", () => {
    it("기존 유저가 존재하면 유저를 생성하지 않는다", async () => {
      const existingUser = { userId: "userExist" };
      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValue(existingUser);

      jest.spyOn(RefreshToken, "create").mockReturnValue({
        id: {
          unpack: () => jest.fn(),
        },
        getProps: () => jest.fn(),
      } as any);

      const insert = jest.spyOn(manager, "insert");

      const generateAccessToken = jest
        .spyOn(jwtManager, "generateAccessToken")
        .mockResolvedValue("ACCESS_TOKEN");

      const generateRefreshToken = jest
        .spyOn(jwtManager, "generateRefreshToken")
        .mockResolvedValue("REFRESH_TOKEN");

      const result = await handler.execute(command);

      expect(result).toEqual({ AT: "ACCESS_TOKEN", RT: "REFRESH_TOKEN" });

      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith(AuthSocialEntity, {
        where: {
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO.value,
        },
      });

      expect(tokenConfig.refreshTokenExpiresIn).toBe("7d");

      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith(
        RefreshTokenEntity,
        expect.any(Object)
      );

      expect(generateAccessToken).toHaveBeenCalledWith(
        existingUser.userId,
        expect.any(String)
      );
      expect(generateRefreshToken).toHaveBeenCalledWith(existingUser.userId);
    });

    it("유저가 존재하지 않으면 새 유저와 소셜 계정을 생성한다", async () => {
      const findOne = jest.spyOn(manager, "findOne").mockResolvedValue(null);

      const insert = jest.spyOn(manager, "insert");

      jest.spyOn(User, "create").mockReturnValue({
        id: {
          unpack: () => jest.fn(),
        },
        getProps: () => jest.fn(),
      } as any);

      jest.spyOn(AuthSocial, "create").mockReturnValue({
        id: {
          unpack: () => jest.fn(),
        },
        getProps: () => ({
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO,
          userId: "newUserId",
        }),
      } as any);

      jest.spyOn(RefreshToken, "create").mockReturnValue({
        id: {
          unpack: () => jest.fn(),
        },
        getProps: () => jest.fn(),
      } as any);

      const generateAccessToken = jest
        .spyOn(jwtManager, "generateAccessToken")
        .mockResolvedValue("ACCESS_TOKEN");

      const generateRefreshToken = jest
        .spyOn(jwtManager, "generateRefreshToken")
        .mockResolvedValue("REFRESH_TOKEN");

      const result = await handler.execute(command);

      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith(AuthSocialEntity, {
        where: {
          externalId: command.externalId,
          socialCode: SocialCodeVO.KAKAO.value,
        },
      });

      expect(tokenConfig.refreshTokenExpiresIn).toBe("7d");

      expect(insert).toHaveBeenCalledTimes(3);
      expect(insert).toHaveBeenNthCalledWith(1, UserEntity, expect.any(Object));
      expect(insert).toHaveBeenNthCalledWith(
        2,
        AuthSocialEntity,
        expect.any(Object)
      );
      expect(insert).toHaveBeenNthCalledWith(
        3,
        RefreshTokenEntity,
        expect.any(Object)
      );

      expect(generateAccessToken).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String)
      );
      expect(generateRefreshToken).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({ AT: "ACCESS_TOKEN", RT: "REFRESH_TOKEN" });
    });
  });
});
