import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager } from "typeorm";
import { CreateDefaultFolderEvent } from "src/common";
import { Folder as FolderEntity, MockEntityManager } from "src/database";
import { DefaultFolderList } from "../../constants";
import { CreateDefaultFolderEventHandler } from "../../events";
import { randomUUID } from "crypto";

describe("CreateDefaultFolderEventHandler", () => {
  let handler: CreateDefaultFolderEventHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDefaultFolderEventHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get(CreateDefaultFolderEventHandler);
    manager = module.get(EntityManager);
  });

  describe("handle", () => {
    it("기본 폴더 6개를 생성한다", async () => {
      const userId = randomUUID();
      const event = CreateDefaultFolderEvent.from({ userId });

      const insert = jest.spyOn(manager, "insert");

      await handler.handle(event);

      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith(
        FolderEntity,
        expect.arrayContaining(
          DefaultFolderList.map((folder) =>
            expect.objectContaining({
              name: folder.name,
              widthName: folder.widthName,
              heightName: folder.heightName,
              userId,
            })
          )
        )
      );

      const insertedData = insert.mock.calls[0][1];
      expect(insertedData).toHaveLength(6);
    });
  });
});
