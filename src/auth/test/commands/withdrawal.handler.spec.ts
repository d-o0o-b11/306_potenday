import { EntityManager } from "typeorm";
import { WithdrawalCommand, WithdrawalCommandHandler } from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "src/database";
import { randomUUID } from "crypto";

describe("WithdrawalCommandHandler", () => {
  let handler: WithdrawalCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalCommandHandler,
        {
          provide: EntityManager,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<WithdrawalCommandHandler>(WithdrawalCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  const command = new WithdrawalCommand(randomUUID());

  describe("execute", () => {
    it("유저를 삭제한다", async () => {
      const deleteSpy = jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 1,
      } as any);

      await handler.execute(command);
      expect(deleteSpy).toHaveBeenCalledWith(User, { id: command.userId });
    });

    it("유저 삭제 실패시 예외를 발생한다", async () => {
      jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 0,
      } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        "회원탈퇴 실패했습니다."
      );
    });
  });
});
