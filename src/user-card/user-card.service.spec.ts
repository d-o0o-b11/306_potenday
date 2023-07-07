import { Test, TestingModule } from "@nestjs/testing";
import { UserCardService } from "./user-card.service";
import { ILike, Repository, getRepository } from "typeorm";
import { UserCardEntity } from "./entities/user-card.entity";
import { UserFolderService } from "src/user-folder/user-folder.service";
import { mockRepository } from "src/mock.repository";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("UserCardService", () => {
  let service: UserCardService;
  let userCardRepository: Repository<UserCardEntity>;
  let userFolderService: UserFolderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCardService,
        {
          provide: getRepositoryToken(UserCardEntity),
          useValue: mockRepository(),
        },
        {
          provide: UserFolderService,
          useValue: {
            findDefaultFolderName: jest.fn(),
            findCustomFolderName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserCardService>(UserCardService);
    userCardRepository = module.get<Repository<UserCardEntity>>(
      getRepositoryToken(UserCardEntity)
    );
    userFolderService = module.get<UserFolderService>(UserFolderService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(userCardRepository).toBeDefined();
    expect(userFolderService).toBeDefined();
  });

  describe("createUserCard", () => {
    const createUserCardDto = {
      top: 3,
      left: 3,
      title: "제목",
      context: "내용",
      default_folder_id: 1,
      user_folder_id: undefined,
      finish_active: false,
      user_id: 1,
    } as any;

    const userCareEntity = {
      id: 1,
      top: 3,
      left: 3,
      title: "제목",
      context: "내용",
      default_folder_id: 1,
      user_folder_id: undefined,
      finish_active: false,
    } as any;

    const user_id = 1;

    it("위시 카드 생성", async () => {
      const saveResult = jest
        .spyOn(userCardRepository, "save")
        .mockResolvedValue(userCareEntity);

      await service.createUserCard(createUserCardDto, user_id);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(createUserCardDto);
    });
  });

  describe("updateUserCard", () => {
    const updateUserCardDto = {
      card_id: 1,
      title: "제목수정",
    } as any;

    it("위시 카드 수정 실패", async () => {
      const updateResult = jest
        .spyOn(userCardRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 0,
          generatedMaps: [],
        });

      await expect(
        async () => await service.updateUserCard(updateUserCardDto)
      ).rejects.toThrow(new Error("위시 카드 제목, 내용 수정 실패"));

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(updateUserCardDto.card_id, {
        title: updateUserCardDto.title,
        context: undefined,
        top: undefined,
        left: undefined,
      });
    });

    it("위시 카드 수정", async () => {
      const updateResult = jest
        .spyOn(userCardRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.updateUserCard(updateUserCardDto);

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(updateUserCardDto.card_id, {
        title: updateUserCardDto.title,
        context: undefined,
        top: undefined,
        left: undefined,
      });
    });
  });

  describe("updateUserCardFolderState", () => {
    const card_id = 1;

    const findResultDataFalse = {
      id: 1,
      top: 3,
      left: 3,
      title: "제목",
      context: "내용",
      default_folder_id: 1,
      user_folder_id: undefined,
      user_id: 3,
      created_at: "2022-02-02",
      finish_active: false,
      finish_day: undefined,
      folded_state: false,
    } as any;

    const findResultDataTrue = {
      id: 1,
      top: 3,
      left: 3,
      title: "제목",
      context: "내용",
      default_folder_id: 1,
      user_folder_id: undefined,
      user_id: 3,
      created_at: "2022-02-02",
      finish_active: false,
      finish_day: undefined,
      folded_state: true,
    } as any;

    it("위시 카드 열린상태 false -> 닫힌 상태로 변경 true", async () => {
      const findResult = jest
        .spyOn(userCardRepository, "findOne")
        .mockResolvedValue(findResultDataFalse);

      const updateTrue = jest.spyOn(userCardRepository, "update");

      await service.updateUserCardFolderState(card_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: card_id,
        },
      });

      expect(updateTrue).toBeCalledTimes(1);
      expect(updateTrue).toBeCalledWith(card_id, {
        folded_state: true,
      });
    });

    it("위시 카드 열린상태 true -> 닫힌 상태로 변경 false", async () => {
      const findResult = jest
        .spyOn(userCardRepository, "findOne")
        .mockResolvedValue(findResultDataTrue);

      const updateTrue = jest.spyOn(userCardRepository, "update");

      await service.updateUserCardFolderState(card_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: card_id,
        },
      });

      expect(updateTrue).toBeCalledTimes(1);
      expect(updateTrue).toBeCalledWith(card_id, {
        folded_state: false,
      });
    });
  });

  describe("findUserCard", () => {
    const findAllUserCardDto = {
      default_folder_id: 1,
      user_folder_id: undefined,
    } as any;

    const findAllUserCardUserDto = {
      default_folder_id: undefined,
      user_folder_id: 1,
    } as any;

    const findResultDataFalse = [
      {
        id: 1,
        top: 3,
        left: 3,
        title: "제목",
        context: "내용",
        default_folder_id: 1,
        user_folder_id: undefined,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: false,
        finish_day: undefined,
        folded_state: false,
      },
      {
        id: 2,
        top: 3,
        left: 3,
        title: "제목22",
        context: "내용22",
        default_folder_id: 1,
        user_folder_id: undefined,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: false,
        finish_day: undefined,
        folded_state: false,
      },
    ] as any;

    const findResultDataFalseUser = [
      {
        id: 2,
        top: 3,
        left: 3,
        title: "제목22",
        context: "내용22",
        default_folder_id: 1,
        user_folder_id: undefined,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: false,
        finish_day: undefined,
        folded_state: false,
      },
    ] as any;

    const user_id = 3;

    it("기본폴더 중 특정 한 곳에 해당하는 위시 카드들 출력", async () => {
      const findResult = jest
        .spyOn(userCardRepository, "find")
        .mockResolvedValue(findResultDataFalse);

      await service.findUserCardOfFolder(findAllUserCardDto, user_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          user_id: user_id,
          default_folder_id: findAllUserCardDto.default_folder_id,
          finish_active: false,
        },
        order: {
          id: "ASC",
        },
      });
    });

    it("유저 커스텀 폴더 중 특정 한 곳에 해당하는 위시 카드들 출력", async () => {
      const findResult = jest
        .spyOn(userCardRepository, "find")
        .mockResolvedValue(findResultDataFalseUser);

      await service.findUserCardOfFolder(findAllUserCardUserDto, user_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          user_id: user_id,
          user_folder_id: findAllUserCardUserDto.user_folder_id,
          finish_active: false,
        },
        order: {
          id: "ASC",
        },
      });
    });
  });

  describe("deleteUserCard", () => {
    const card_id = 1;

    it("위시 카드 삭제 실패", async () => {
      const deleteResult = jest
        .spyOn(userCardRepository, "delete")
        .mockResolvedValue({
          raw: [],
          affected: 0,
        });

      await expect(
        async () => await service.deleteUserCard(card_id)
      ).rejects.toThrow(new Error("위시 카드 삭제 실패"));

      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(card_id);
    });

    it("위시 카드 삭제", async () => {
      const deleteResult = jest
        .spyOn(userCardRepository, "delete")
        .mockResolvedValue({
          raw: [],
          affected: 1,
        });

      await service.deleteUserCard(card_id);

      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(card_id);
    });
  });

  describe("findAllUserCard", () => {
    const user_id = 1;

    const findResultUserCard = [
      {
        id: 1,
        top: 3,
        left: 3,
        title: "제목",
        context: "내용",
        default_folder_id: 1,
        user_folder_id: undefined,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: false,
        finish_day: undefined,
        folded_state: false,
      },
      {
        id: 2,
        top: 3,
        left: 3,
        title: "제목22",
        context: "내용22",
        default_folder_id: undefined,
        user_folder_id: 1,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: true,
        finish_day: "2023-02-02",
        folded_state: false,
      },
    ] as any;

    const defaultFolderName = {
      folder_name: "DEFAULT_FOLDER_NAME",
    } as any;

    const customFolderName = {
      folder_name: "CUSTOM_FOLDER_NAME",
    } as any;

    it("메인페이지 표에 들어갈 모든 유저 위시 카드 출력", async () => {
      const findUserCardResult = jest
        .spyOn(userCardRepository, "find")
        .mockResolvedValue(findResultUserCard);

      const defaultFolderResult = jest
        .spyOn(userFolderService, "findDefaultFolderName")
        .mockResolvedValue(defaultFolderName);

      const customeFolderResult = jest
        .spyOn(userFolderService, "findCustomFolderName")
        .mockResolvedValue(customFolderName);

      const server = await service.findAllUserCard(user_id);

      expect(findUserCardResult).toBeCalledTimes(1);
      expect(findUserCardResult).toBeCalledWith({
        where: {
          user_id: user_id,
        },
        order: {
          id: "ASC",
        },
      });

      expect(defaultFolderResult).toBeCalledTimes(1);
      expect(defaultFolderResult).toBeCalledWith(
        findResultUserCard[0].default_folder_id
      );

      expect(customeFolderResult).toBeCalledTimes(1);
      expect(customeFolderResult).toBeCalledWith(
        findResultUserCard[1].user_folder_id
      );

      expect(server).toStrictEqual([
        {
          folderName: "DEFAULT_FOLDER_NAME",
          title: "제목",
          createdAt: "2022-02-02",
          finishDay: false,
        },
        {
          folderName: "CUSTOM_FOLDER_NAME",
          title: "제목22",
          createdAt: "2022-02-02",
          finishDay: "2023-02-02",
        },
      ]);
    });
  });

  describe("searchAllUserCard", () => {
    const user_id = 1;
    const search_word = "22";

    const findResultUserCard = [
      {
        id: 2,
        top: 3,
        left: 3,
        title: "제목22",
        context: "내용22",
        default_folder_id: undefined,
        user_folder_id: 1,
        user_id: 3,
        created_at: "2022-02-02",
        finish_active: true,
        finish_day: "2023-02-02",
        folded_state: false,
      },
    ] as any;

    const customFolderName = {
      folder_name: "CUSTOM_FOLDER_NAME",
    } as any;

    it("검색 기능, folderName/title/createdAt/finishDay만 return", async () => {
      const findUserCardResult = jest
        .spyOn(userCardRepository, "find")
        .mockResolvedValue(findResultUserCard);

      const customFolderResult = jest
        .spyOn(userFolderService, "findCustomFolderName")
        .mockResolvedValue(customFolderName);

      const server = await service.searchAllUserCard(user_id, search_word);

      expect(findUserCardResult).toBeCalledTimes(1);
      expect(findUserCardResult).toBeCalledWith({
        where: {
          user_id: user_id,
          title: ILike(`%${search_word}%`),
        },
        order: {
          id: "ASC",
        },
      });

      expect(customFolderResult).toBeCalledTimes(1);
      expect(customFolderResult).toBeCalledWith(
        findResultUserCard[0].user_folder_id
      );

      expect(server).toStrictEqual([
        {
          folderName: "CUSTOM_FOLDER_NAME",
          title: "제목22",
          createdAt: "2022-02-02",
          finishDay: "2023-02-02",
        },
      ]);
    });
  });

  describe("finishUserCardCount", () => {
    const user_id = 1;

    it("메인페이지에 들어감, 전체 위시 갯수/카드가 많이 존재하는 폴더 순(위시 달성한 갯수/해당 폴더 위시 카드 갯수)", async () => {
      const createQueryBuilder = mockRepository().createQueryBuilder();
      jest
        .spyOn(userCardRepository, "createQueryBuilder")
        .mockReturnValue(createQueryBuilder);

      const query_select = jest.spyOn(createQueryBuilder, "select");
      const query_addSelect = jest.spyOn(createQueryBuilder, "addSelect");
      const query_where = jest.spyOn(createQueryBuilder, "where");
      const query_andWhere = jest.spyOn(createQueryBuilder, "andWhere");
      const query_groupBy = jest.spyOn(createQueryBuilder, "groupBy");
      const query_addGroupBy = jest.spyOn(createQueryBuilder, "addGroupBy");
      const query_orderBy = jest.spyOn(createQueryBuilder, "orderBy");
      const query_take = jest.spyOn(createQueryBuilder, "take");
      const query_getRawMany = jest.spyOn(createQueryBuilder, "getRawMany");

      await service.finishUserCardCount(user_id);

      expect(query_select).toHaveBeenNthCalledWith(
        1,
        "uc.default_folder_id",
        "default_folder_id"
      );
      expect(query_select).toHaveBeenNthCalledWith(2, "COUNT(*)", "count");
      expect(query_select).toHaveBeenNthCalledWith(3, "COUNT(*)", "count");

      expect(query_addSelect).toHaveBeenNthCalledWith(
        1,
        "uc.user_folder_id",
        "user_folder_id"
      );
      expect(query_addSelect).toHaveBeenNthCalledWith(
        2,
        "COUNT(*)",
        "total_count"
      );
      expect(query_addSelect).toHaveBeenNthCalledWith(
        3,
        "COUNT(CASE WHEN uc.finish_active=true THEN 1 END)",
        "finish_active_false_count"
      );

      expect(query_where).toBeCalledTimes(3);
      expect(query_where).toBeCalledWith("uc.user_id = :user_id", { user_id });

      expect(query_andWhere).toBeCalledWith("uc.finish_active=false");

      expect(query_groupBy).toBeCalledWith("uc.default_folder_id");
      expect(query_addGroupBy).toBeCalledWith("uc.user_folder_id");
      expect(query_orderBy).toBeCalledWith("total_count", "DESC");
      expect(query_take).toBeCalledWith(2);

      expect(query_getRawMany).toBeCalledTimes(3);
      expect(query_getRawMany).toBeCalledWith();
    });
  });
});
