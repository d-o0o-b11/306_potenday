import { EntityManager } from "typeorm";
import {
  TokenReissueCommand,
  TokenReissueCommandHandler,
} from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtManagerService } from "src/common";
import { RefreshToken } from "src/database";
import { randomUUID } from "crypto";

describe("TokenReissueCommandHandler", () => {
  let handler: TokenReissueCommandHandler;
  let manager: EntityManager;
  let jwtManager: JwtManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenReissueCommandHandler,
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtManagerService,
          useValue: {
            verifyRefreshToken: jest.fn(),
            generateAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<TokenReissueCommandHandler>(
      TokenReissueCommandHandler
    );
    manager = module.get<EntityManager>(EntityManager);
    jwtManager = module.get<JwtManagerService>(JwtManagerService);
  });

  const command = new TokenReissueCommand(randomUUID(), randomUUID());

  describe("execute", () => {
    it("AT을 재발급한다", async () => {
      const mockRefreshToken = {
        id: randomUUID(),
        userId: command.userId,
        token: "valid-refresh-token",
        sessionId: command.sessionId,
        expiredAt: new Date(Date.now() + 1000 * 60 * 10), // 10분 후
      };

      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValue(mockRefreshToken);

      const verifyRefreshToken = jest
        .spyOn(jwtManager, "verifyRefreshToken")
        .mockResolvedValue({
          userId: command.userId,
        });

      const generateAccessToken = jest
        .spyOn(jwtManager, "generateAccessToken")
        .mockResolvedValue("new-access-token");

      const result = await handler.execute(command);

      expect(result.AT).toBe("new-access-token");
      expect(findOne).toHaveBeenCalledWith(RefreshToken, {
        where: {
          userId: command.userId,
          sessionId: command.sessionId,
        },
      });
      expect(verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken.token);
      expect(generateAccessToken).toHaveBeenCalledWith(
        command.userId,
        command.sessionId
      );
    });

    it("RT가 존재하지 않을 경우 에러를 발생한다", async () => {
      const findOne = jest.spyOn(manager, "findOne").mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        "Refresh token이 존재하지 않습니다."
      );

      expect(findOne).toHaveBeenCalledWith(RefreshToken, {
        where: {
          userId: command.userId,
          sessionId: command.sessionId,
        },
      });
    });

    it("RT가 만료되었을 경우 에러를 발생한다", async () => {
      const expiredRT = {
        id: randomUUID(),
        userId: command.userId,
        token: "expired-token",
        sessionId: command.sessionId,
        expiredAt: new Date(Date.now() - 1000 * 60), // 1분 전
      };

      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValue(expiredRT);

      await expect(handler.execute(command)).rejects.toThrow(
        "Expired At은 현재 시점 이후여야 합니다."
      );

      expect(findOne).toHaveBeenCalledWith(RefreshToken, {
        where: {
          userId: command.userId,
          sessionId: command.sessionId,
        },
      });
    });

    it("RT가 유효하지 않을 경우 에러를 발생한다", async () => {
      const mockRefreshToken = {
        id: randomUUID(),
        userId: command.userId,
        token: "invalid-token",
        sessionId: command.sessionId,
        expiredAt: new Date(Date.now() + 1000 * 60 * 10),
      };

      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValue(mockRefreshToken);

      const verifyRefreshToken = jest
        .spyOn(jwtManager, "verifyRefreshToken")
        .mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        "유효하지 않은 Refresh token입니다."
      );

      expect(findOne).toHaveBeenCalledWith(RefreshToken, {
        where: {
          userId: command.userId,
          sessionId: command.sessionId,
        },
      });
      expect(verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken.token);
    });
  });
});
