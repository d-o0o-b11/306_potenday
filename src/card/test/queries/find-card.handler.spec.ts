import { EntityManager } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { FindCardQuery, FindCardQueryHandler } from "../../queries";
import { Card as CardEntity, MockEntityManager } from "src/database";

describe("FindCardQueryHandler", () => {
  let handler: FindCardQueryHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCardQueryHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<FindCardQueryHandler>(FindCardQueryHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const query = new FindCardQuery(userId);

    it("카드 목록을 조회한다", async () => {
      const mockCards = [
        {
          id: randomUUID(),
          title: "제목1",
          context: "내용1",
          top: 100,
          left: 200,
          userId,
          folderId: randomUUID(),
          finishDate: new Date("2025-06-23T00:00:00Z"),
          foldedState: false,
        },
        {
          id: randomUUID(),
          title: "제목2",
          context: "내용2",
          top: 150,
          left: 250,
          userId,
          folderId: randomUUID(),
          finishDate: null,
          foldedState: true,
        },
      ] as any;

      const find = jest.spyOn(manager, "find").mockResolvedValue(mockCards);

      const result = await handler.execute(query);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(CardEntity, {
        where: { userId },
        order: { createdAt: "ASC" },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        cardId: mockCards[0].id,
        title: mockCards[0].title,
        context: mockCards[0].context,
        top: mockCards[0].top,
        left: mockCards[0].left,
        finishDate: mockCards[0].finishDate,
        foldedState: mockCards[0].foldedState,
      });
    });

    it("카드가 없으면 빈 배열을 반환한다", async () => {
      const find = jest.spyOn(manager, "find").mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
