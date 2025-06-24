import { EntityManager } from "typeorm";
import {
  FindFolderCardListQuery,
  FindFolderCardListQueryHandler,
} from "../../queries";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { Card } from "src/database";
import { MockEntityManager } from "src/database";

describe("FindFolderCardListQueryHandler", () => {
  let handler: FindFolderCardListQueryHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindFolderCardListQueryHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<FindFolderCardListQueryHandler>(
      FindFolderCardListQueryHandler
    );
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const folderId = randomUUID();
    const query = new FindFolderCardListQuery(userId, folderId);

    it("해당 폴더의 카드 목록을 조회한다", async () => {
      const mockCardList = [
        {
          id: randomUUID(),
          userId,
          folderId,
          title: "제목 1",
          context: "내용 1",
          top: 100,
          left: 200,
          finishDate: null,
          foldedState: false,
          createdAt: new Date("2025-06-23"),
        },
        {
          id: randomUUID(),
          userId,
          folderId,
          title: "제목 2",
          context: "내용 2",
          top: 150,
          left: 250,
          finishDate: new Date("2024-06-24"),
          foldedState: true,
          createdAt: new Date("2025-06-24"),
        },
      ];

      const find = jest
        .spyOn(manager, "find")
        .mockResolvedValue(mockCardList as any);

      const result = await handler.execute(query);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(Card, {
        where: { userId, folderId },
        order: { createdAt: "ASC" },
      });

      expect(result).toEqual(
        mockCardList.map((card) => ({
          cardId: card.id,
          title: card.title,
          context: card.context,
          top: card.top,
          left: card.left,
          finishDate: card.finishDate,
          foldedState: card.foldedState,
        }))
      );
    });

    it("카드가 하나도 없을 경우 빈 배열을 반환한다", async () => {
      jest.spyOn(manager, "find").mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
    });
  });
});
