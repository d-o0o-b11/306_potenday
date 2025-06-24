import { EntityManager } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import {
  UpdateStatusCardCommand,
  UpdateStatusCardCommandHandler,
} from "../../commands";
import { Card as CardEntity, MockEntityManager } from "src/database";

describe("UpdateStatusCardCommandHandler", () => {
  let handler: UpdateStatusCardCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStatusCardCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get(UpdateStatusCardCommandHandler);
    manager = module.get(EntityManager);
  });

  describe("execute", () => {
    const command = new UpdateStatusCardCommand(
      randomUUID(),
      randomUUID(),
      true // 완료
    );

    const mockCard = {
      id: command.cardId,
      userId: command.userId,
      title: "카드 제목",
      context: "카드 내용",
      top: 100,
      left: 100,
      folderId: randomUUID(),
      finishDate: null,
      foldedState: false,
    } as any;

    it("카드 완료 상태를 업데이트한다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValueOnce(mockCard);
      const update = jest
        .spyOn(manager, "update")
        .mockResolvedValue({ affected: 1 } as any);

      await handler.execute(command);

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(
        CardEntity,
        command.cardId,
        expect.objectContaining({
          id: command.cardId,
          finishDate: expect.any(Date),
        })
      );
    });

    it("카드를 찾지 못하면 예외를 발생한다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        "존재하지 않는 카드입니다."
      );
    });

    it("업데이트 실패 시 예외를 발생한다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValue(mockCard);
      jest.spyOn(manager, "update").mockResolvedValue({ affected: 0 } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        "카드 완료 상태 업데이트에 실패했습니다."
      );
    });
  });
});
