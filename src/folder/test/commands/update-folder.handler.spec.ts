import { EntityManager } from "typeorm";
import {
  UpdateFolderCommand,
  UpdateFolderCommandHandler,
} from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { Folder } from "src/database";
import { MockEntityManager } from "src/database";

describe("UpdateFolderCommandHandler", () => {
  let handler: UpdateFolderCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFolderCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<UpdateFolderCommandHandler>(
      UpdateFolderCommandHandler
    );
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userId = randomUUID();
    const folderId = randomUUID();

    const command = new UpdateFolderCommand(
      userId,
      folderId,
      "New Name",
      "긴급도",
      "중요도"
    );

    const mockFolderEntity = {
      id: folderId,
      userId,
      name: "Old Name",
      widthName: "기존 가로축",
      heightName: "기존 세로축",
    };

    const updatedEntity = {
      id: folderId,
      userId,
      name: command.name,
      widthName: command.widthName,
      heightName: command.heightName,
    };

    it("폴더를 정상적으로 업데이트한다", async () => {
      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(mockFolderEntity)
        .mockResolvedValueOnce(updatedEntity);

      const update = jest.spyOn(manager, "update").mockResolvedValue({
        affected: 1,
      } as any);

      const result = await handler.execute(command);

      expect(findOne).toHaveBeenCalledTimes(2);
      expect(findOne).toHaveBeenNthCalledWith(1, Folder, {
        where: { id: folderId, userId },
      });

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(
        Folder,
        folderId,
        expect.objectContaining({
          id: folderId,
          name: command.name,
          widthName: command.widthName,
          heightName: command.heightName,
          userId,
        })
      );

      expect(findOne).toHaveBeenNthCalledWith(2, Folder, {
        where: { id: folderId, userId },
      });

      expect(result).toEqual({
        folderId,
        name: command.name,
        widthName: command.widthName,
        heightName: command.heightName,
      });
    });

    it("폴더가 존재하지 않으면 예외를 발생시킨다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValueOnce(null);

      await expect(handler.execute(command)).rejects.toThrow(
        "존재하지 않는 폴더입니다."
      );
    });

    it("업데이트 실패 시 예외를 발생시킨다", async () => {
      jest.spyOn(manager, "findOne").mockResolvedValueOnce(mockFolderEntity);

      jest.spyOn(manager, "update").mockResolvedValue({
        affected: 0,
      } as any);

      await expect(handler.execute(command)).rejects.toThrow(
        "폴더 업데이트에 실패했습니다."
      );
    });
  });
});
