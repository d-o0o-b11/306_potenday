import { Test, TestingModule } from "@nestjs/testing";
import { LogoutCommand, LogoutCommandHandler } from "../../commands";
import { RefreshToken } from "src/database";
import { EntityManager } from "typeorm";
import { randomUUID } from "crypto";

describe("LogoutCommandHandler", () => {
  let handler: LogoutCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutCommandHandler,
        {
          provide: EntityManager,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LogoutCommandHandler>(LogoutCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  const command = new LogoutCommand(randomUUID(), randomUUID());

  describe("execute", () => {
    it("유저의 RT를 삭제한다", async () => {
      const deleteSpy = jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 1,
      } as any);

      await handler.execute(command);
      expect(deleteSpy).toHaveBeenCalledWith(RefreshToken, {
        userId: command.userId,
        sessionId: command.sessionId,
      });
    });

    it("RT 삭제 실패시 예외를 발생한다", async () => {
      jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 0,
      } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        "Refresh token 삭제 실패했습니다."
      );
    });
  });
});
