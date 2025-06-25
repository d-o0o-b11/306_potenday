import { EntityManager, Like } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { FindTitleCardQuery, FindTitleCardQueryHandler } from "../../queries";
import { Card, MockEntityManager } from "src/database";

describe("FindTitleCardQueryHandler", () => {
  let handler: FindTitleCardQueryHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTitleCardQueryHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<FindTitleCardQueryHandler>(FindTitleCardQueryHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const title = "제목";
    const query = new FindTitleCardQuery(title, userId);

    it("제목에 해당하는 카드들을 조회한다", async () => {
      const mockCardList = [
        {
          title: "제목 1",
          createdAt: new Date("2025-06-22"),
          finishDate: null,
          folder: { name: "폴더 A" },
        },
        {
          title: "제목 2",
          createdAt: new Date("2025-06-23"),
          finishDate: new Date("2025-06-24"),
          folder: { name: "폴더 B" },
        },
      ] as any;

      const find = jest
        .spyOn(manager, "find")
        .mockResolvedValue(mockCardList as Card[]);

      const result = await handler.execute(query);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(Card, {
        where: {
          title: Like(`%${title}%`),
          userId,
        },
        order: { createdAt: "ASC" },
        relations: { folder: true },
        select: {
          title: true,
          createdAt: true,
          finishDate: true,
          folder: {
            name: true,
          },
        },
      });

      expect(result).toEqual([
        {
          folderName: "폴더 A",
          title: "제목 1",
          createdAt: mockCardList[0].createdAt,
          finishDate: null,
        },
        {
          folderName: "폴더 B",
          title: "제목 2",
          createdAt: mockCardList[1].createdAt,
          finishDate: mockCardList[1].finishDate,
        },
      ]);
    });

    it("일치하는 카드가 없을 경우 빈 배열을 반환한다", async () => {
      jest.spyOn(manager, "find").mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
    });
  });
});
