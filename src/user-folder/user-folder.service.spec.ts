import { Test, TestingModule } from "@nestjs/testing";
import { UserFolderService } from "./user-folder.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { Repository } from "typeorm";
import { mockRepository } from "src/mock/mock.repository";
import { UserFolderEntity } from "./entities/user-folder.entity";

describe("UserFolderService", () => {
  let service: UserFolderService;
  let defaultRepository: Repository<DefaultFolderEntity>;
  let newUserFolderRepository: Repository<UserFolderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFolderService,
        {
          provide: getRepositoryToken(DefaultFolderEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserFolderEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserFolderService>(UserFolderService);
    defaultRepository = module.get<Repository<DefaultFolderEntity>>(
      getRepositoryToken(DefaultFolderEntity)
    );
    newUserFolderRepository = module.get<Repository<UserFolderEntity>>(
      getRepositoryToken(UserFolderEntity)
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(defaultRepository).toBeDefined();
    expect(newUserFolderRepository).toBeDefined();
  });

  describe("createCustomUserFolder", () => {
    const folder_name = "new폴더";
    const user_id = 1;

    const saveData = {
      id: 1,
      folder_name: "new폴더",
      user_id: 1,
      created_at: new Date("2023-03-03"),
    } as any;

    it("커스텀 폴더 생성", async () => {
      const saveResult = jest
        .spyOn(newUserFolderRepository, "save")
        .mockResolvedValue(saveData);

      await service.createCustomUserFolder(folder_name, user_id);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(
        new UserFolderEntity({
          folder_name: folder_name,
          user_id: user_id,
          width: "시급도",
          height: "중요도",
        })
      );
    });
  });

  describe("updateCustomUserFolder", () => {
    const updateData = {
      folder_id: 1,
      folder_name: "수정폴더명",
    } as any;

    it("커스텀 폴더명 수정 error", async () => {
      const saveResult = jest
        .spyOn(newUserFolderRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 0,
          generatedMaps: [],
        });

      await expect(
        async () => await service.updateCustomUserFolder(updateData)
      ).rejects.toThrow(new Error("폴더명 수정 실패"));

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(updateData.folder_id, {
        folder_name: updateData.folder_name,
      });
    });

    it("커스텀 폴더명 수정", async () => {
      const saveResult = jest
        .spyOn(newUserFolderRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.updateCustomUserFolder(updateData);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(updateData.folder_id, {
        folder_name: updateData.folder_name,
      });
    });
  });

  describe("getAllUserFoler", () => {
    const user_id = 1;

    const defaultFolerData = [
      {
        id: 1,
        folder_name: "기본 폴더1",
        width: 3,
        height: 3,
      },
      {
        id: 2,
        folder_name: "기본 폴더2",
        width: 3,
        height: 3,
      },
    ] as any;

    const userFolderData = [
      {
        id: 1,
        folder_name: "커스텀 폴더1",
        user_id: 1,
        created_at: new Date("2023-03-03"),
        width: 7,
        height: 7,
      },
    ] as any;

    it("유저가 소지하고 있는 모든 폴더명 출력", async () => {
      const findDefaultFolder = jest
        .spyOn(defaultRepository, "find")
        .mockResolvedValue(defaultFolerData);

      const findCustomFolder = jest
        .spyOn(newUserFolderRepository, "find")
        .mockResolvedValue(userFolderData);

      await service.getAllUserFoler(user_id);

      expect(findDefaultFolder).toBeCalledTimes(1);
      expect(findDefaultFolder).toBeCalledWith({
        order: {
          id: "ASC",
        },
      });
      expect(findCustomFolder).toBeCalledTimes(1);
      expect(findCustomFolder).toBeCalledWith({
        where: {
          user_id: user_id,
        },
        order: {
          id: "ASC",
        },
      });
    });
  });

  describe("deleteCustomUserFolder", () => {
    const folder_id = 1;

    it("커스텀 폴더 삭제 error", async () => {
      const deleteResult = jest
        .spyOn(newUserFolderRepository, "delete")
        .mockResolvedValue({
          raw: [],
          affected: 0,
        });

      await expect(
        async () => await service.deleteCustomUserFolder(folder_id)
      ).rejects.toThrow(new Error("폴더 삭제 실패"));

      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(folder_id);
    });

    it("커스텀 폴더 삭제", async () => {
      const deleteResult = jest
        .spyOn(newUserFolderRepository, "delete")
        .mockResolvedValue({
          raw: [],
          affected: 1,
        });

      await service.deleteCustomUserFolder(folder_id);

      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(folder_id);
    });
  });

  describe("updateHorizontalVerticalAxis", () => {
    const updateData = {
      folder_id: 1,
      widht: 3,
      height: 7,
    } as any;

    it("커스텀 폴더 가로/세로 축 명 수정 error", async () => {
      const updateResult = jest
        .spyOn(newUserFolderRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 0,
          generatedMaps: [],
        });

      await expect(
        async () => await service.updateHorizontalVerticalAxis(updateData)
      ).rejects.toThrow(new Error("폴더 축 이름 설정 실패"));

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(updateData.folder_id, {
        width: updateData.width,
        height: updateData.height,
      });
    });

    it("커스텀 폴더 가로/세로 축 명 수정", async () => {
      const updateResult = jest
        .spyOn(newUserFolderRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.updateHorizontalVerticalAxis(updateData);

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(updateData.folder_id, {
        width: updateData.width,
        height: updateData.height,
      });
    });
  });

  describe("findDefaultFolderName", () => {
    const folder_id = 1;
    const defaultFolderData = {
      id: 1,
      folder_name: "폴더명",
      width: 3,
      height: 7,
    } as any;

    it("기본 폴더 id -> 기본 폴더 명 찾아서 return", async () => {
      const findResult = jest
        .spyOn(defaultRepository, "findOne")
        .mockResolvedValue(defaultFolderData);

      await service.findDefaultFolderName(folder_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: folder_id,
        },
      });
    });
  });

  describe("findCustomFolderName", () => {
    const folder_id = 1;
    const customFolderData = {
      id: 1,
      folder_name: "폴더폴도",
      user_id: 1,
      created_at: new Date("2023-03-03"),
      width: 7,
      height: 7,
    } as any;

    it("사용자가 생성한 폴더 id -> 폴더명으로 출력", async () => {
      const findResult = jest
        .spyOn(newUserFolderRepository, "findOne")
        .mockResolvedValue(customFolderData);

      await service.findCustomFolderName(folder_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: folder_id,
        },
      });
    });
  });
});
