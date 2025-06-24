import { EntityManager } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { UpdateCardCommand, UpdateCardCommandHandler } from "../../commands";
import { Card as CardEntity, MockEntityManager } from "src/database";

describe("UpdateCardCommandHandler", () => {
  let handler: UpdateCardCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCardCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<UpdateCardCommandHandler>(UpdateCardCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const command = new UpdateCardCommand(
      randomUUID(),
      randomUUID(),
      "업데이트된 제목",
      "업데이트된 내용",
      200,
      150,
      true
    );

    const mockCard = {
      id: command.cardId,
      userId: command.userId,
      title: "기존 제목",
      context: "기존 내용",
      top: 100,
      left: 100,
      folderId: randomUUID(),
      finishDate: null,
      foldedState: false,
    } as any;

    it("카드를 성공적으로 업데이트한다", async () => {
      jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(mockCard)
        .mockResolvedValueOnce({ ...mockCard, ...command });

      const update = jest
        .spyOn(manager, "update")
        .mockResolvedValue({ affected: 1 } as any);

      const result = await handler.execute(command);

      expect(update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        cardId: command.cardId,
        title: command.title,
        context: command.context,
        top: command.top,
        left: command.left,
        finishDate: null,
        foldedState: command.foldedState,
      });
    });

    it("카드를 찾을 수 없으면 예외를 발생한다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        "존재하지 않는 카드입니다."
      );
    });

    it("업데이트에 실패하면 예외를 발생한다", async () => {
      jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(mockCard)
        .mockResolvedValueOnce(mockCard);

      jest.spyOn(manager, "update").mockResolvedValue({ affected: 0 } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        "카드 업데이트에 실패했습니다."
      );
    });
  });
});
