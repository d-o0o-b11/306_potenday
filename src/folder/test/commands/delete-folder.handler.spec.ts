import { EntityManager } from "typeorm";
import {
  DeleteFolderCommand,
  DeleteFolderCommandHandler,
} from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { Folder } from "src/database";
import { MockEntityManager } from "src/database";

describe("DeleteFolderCommandHandler", () => {
  let handler: DeleteFolderCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFolderCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<DeleteFolderCommandHandler>(
      DeleteFolderCommandHandler
    );
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const folderId = randomUUID();

    it("폴더를 정상적으로 삭제한다", async () => {
      const command = new DeleteFolderCommand(userId, folderId);

      const deleteSpy = jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 1,
      } as any);

      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(Folder, {
        id: folderId,
        userId: userId,
      });
    });

    it("삭제할 폴더가 없으면 예외를 발생시킨다", async () => {
      const command = new DeleteFolderCommand(userId, folderId);

      jest.spyOn(manager, "delete").mockResolvedValue({
        affected: 0,
      } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        `Folder with ID ${folderId} not found for user ${userId}`
      );
    });
  });
});
