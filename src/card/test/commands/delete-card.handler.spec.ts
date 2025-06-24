import { EntityManager } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { DeleteCardCommand, DeleteCardCommandHandler } from "../../commands";
import { Card as CardEntity, MockEntityManager } from "src/database";

describe("DeleteCardCommandHandler", () => {
  let handler: DeleteCardCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCardCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<DeleteCardCommandHandler>(DeleteCardCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    it("카드를 삭제한다", async () => {
      const command = new DeleteCardCommand(randomUUID(), randomUUID());

      const deleteSpy = jest
        .spyOn(manager, "delete")
        .mockResolvedValue({ affected: 1 } as any);

      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(CardEntity, {
        id: command.cardId,
        userId: command.userId,
      });
    });

    it("삭제할 카드가 없으면 예외를 발생한다", async () => {
      const command = new DeleteCardCommand(randomUUID(), randomUUID());

      jest.spyOn(manager, "delete").mockResolvedValue({ affected: 0 } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        `Card with ID ${command.cardId} not found for user ${command.userId}`
      );
    });
  });
});
