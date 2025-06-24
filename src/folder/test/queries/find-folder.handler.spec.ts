import { EntityManager } from "typeorm";
import { FindFolderQuery, FindFolderQueryHandler } from "../../queries";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { Folder } from "src/database";
import { MockEntityManager } from "src/database";

describe("FindFolderQueryHandler", () => {
  let handler: FindFolderQueryHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindFolderQueryHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<FindFolderQueryHandler>(FindFolderQueryHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const query = new FindFolderQuery(userId);

    it("사용자의 폴더 목록을 조회한다", async () => {
      const mockFolderList = [
        {
          id: randomUUID(),
          userId,
          name: "폴더 A",
          widthName: "급함",
          heightName: "중요함",
          createdAt: new Date("2024-01-01"),
        },
        {
          id: randomUUID(),
          userId,
          name: "폴더 B",
          widthName: "긴급도",
          heightName: "중요도",
          createdAt: new Date("2024-01-02"),
        },
      ];

      const find = jest
        .spyOn(manager, "find")
        .mockResolvedValue(mockFolderList as any);

      const result = await handler.execute(query);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(Folder, {
        where: { userId },
        order: { createdAt: "ASC" },
      });

      expect(result).toEqual(
        mockFolderList.map((folder) => ({
          folderId: folder.id,
          name: folder.name,
          widthName: folder.widthName,
          heightName: folder.heightName,
        }))
      );
    });

    it("폴더가 하나도 없을 경우 빈 배열을 반환한다", async () => {
      jest.spyOn(manager, "find").mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
    });
  });
});
