import { EntityManager } from "typeorm";
import {
  CreateFolderCommand,
  CreateFolderCommandHandler,
} from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { MockEntityManager, Folder as FolderEntity } from "src/database";

describe("CreateFolderCommandHandler", () => {
  let handler: CreateFolderCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFolderCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<CreateFolderCommandHandler>(
      CreateFolderCommandHandler
    );
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    it("폴더를 생성한다", async () => {
      const command = new CreateFolderCommand(
        randomUUID(),
        "306 폴더",
        "시급도",
        "중요도"
      );

      const insert = jest.spyOn(manager, "insert");

      await handler.execute(command);

      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith(
        FolderEntity,
        expect.objectContaining({
          id: expect.any(String),
          name: command.name,
          widthName: command.widthName,
          heightName: command.heightName,
          userId: command.userId,
        })
      );
    });
  });
});
