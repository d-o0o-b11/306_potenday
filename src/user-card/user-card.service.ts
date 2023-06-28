import { Injectable } from "@nestjs/common";
import { CreateUserCardDto } from "./dto/create-user-card.dto";
import { UpdateUserCardDto } from "./dto/update-user-card.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCardEntity } from "./entities/user-card.entity";
import {
  Connection,
  ILike,
  Repository,
  getManager,
  getRepository,
} from "typeorm";
import { FindAllUserCard } from "./dto/findAll-card.dto";
import { UserFolderService } from "src/user-folder/user-folder.service";

@Injectable()
export class UserCardService {
  constructor(
    @InjectRepository(UserCardEntity)
    private readonly userCardRepository: Repository<UserCardEntity>,

    private readonly userFolderService: UserFolderService
  ) {}

  async createUserCard(dto: CreateUserCardDto) {
    const saveResult = await this.userCardRepository.save(
      new UserCardEntity({
        top: dto.top,
        left: dto.left,
        title: dto.title,
        context: dto.context,
        default_folder_id: dto?.default_folder_id || undefined,
        user_folder_id: dto?.user_folder_id || undefined,
        finish_active: false,
        user_id: 3, //토큰으로 받기
      })
    );

    return saveResult;
  }

  async updateUserCard(dto: UpdateUserCardDto) {
    const updateResult = await this.userCardRepository.update(dto.card_id, {
      title: dto?.title || undefined,
      context: dto?.context || undefined,
      top: dto?.top || undefined,
      left: dto?.left || undefined,
    });

    return updateResult;
  }

  /** 수정 필요!!!!!!!!!!!
   * 만약 카테고리를 추가할 수 있다면 if default_folder_id가 있는지 추가한 폴더 id가 있는지 확인 후 where문이 바뀔듯
   * @param folder_id
   */
  async findUserCardOfFolder(dto: FindAllUserCard) {
    const { default_folder_id, user_folder_id } = dto;

    if (default_folder_id) {
      const findResult = await this.userCardRepository.find({
        where: {
          default_folder_id: default_folder_id,
        },
        order: {
          id: "ASC",
        },
      });
      return findResult;
    } else if (user_folder_id) {
      const findResult = await this.userCardRepository.find({
        where: {
          user_folder_id: user_folder_id,
        },
        order: {
          id: "ASC",
        },
      });
      return findResult;
    }
  }

  async finishUserCard(card_id: number) {
    const updateResult = await this.userCardRepository.update(card_id, {
      finish_day: new Date(Date.now()),
      finish_active: true,
    });

    return updateResult;
  }

  async deleteUserCard(card_id: number) {
    const deleteResult = await this.userCardRepository.delete(card_id);

    return deleteResult;
  }

  /**
   * 모든 위시 카드 출력
   * 폴더명/위시/위시생성일/이룬날짜
   * (default_foler_id || user_folder_id)/context/created_at/(is_active)
   */

  async findAllUserCard(user_id: number) {
    const findUserCardResult = await this.userCardRepository.find({
      where: {
        user_id: user_id,
      },
      order: {
        id: "ASC",
      },
    });

    let folderName: string;
    let finish_day: Date | boolean;
    const result = findUserCardResult.map(async (n) => {
      //기본 생성 폴더에 위시있는 경우
      if (n.default_folder_id) {
        const folderResult = await this.userFolderService.findDefaultFolderName(
          n.default_folder_id
        );
        folderName = folderResult.folder_name;
      } else {
        //사용자가 생성한 폴더에 위시있는 경우
        const folderResult = await this.userFolderService.findCustomFolderName(
          n.user_folder_id
        );
        folderName = folderResult.folder_name;
      }
      //이룬 위시면 날짜 나오기
      if (n.finish_active) {
        finish_day = n.finish_day;
      } else {
        finish_day = false;
      }
      return {
        folderName,
        context: n.context,
        createdAt: n.created_at,
        finishDay: finish_day,
      };
    });

    // return Promise.all(result);
    const sortedResult = await Promise.all(result);

    //날짜 내림차순
    sortedResult.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedResult;
  }

  async searchAllUserCard(user_id: number, search_word: string) {
    const findUserCardResult = await this.userCardRepository.find({
      where: {
        user_id: user_id,
        context: ILike(`%${search_word}%`),
      },
      order: {
        id: "ASC",
      },
    });

    let folderName: string;
    let finish_day: Date | boolean;
    const result = findUserCardResult.map(async (n) => {
      //기본 생성 폴더에 위시있는 경우
      if (n.default_folder_id) {
        const folderResult = await this.userFolderService.findDefaultFolderName(
          n.default_folder_id
        );
        folderName = folderResult.folder_name;
      } else {
        //사용자가 생성한 폴더에 위시있는 경우
        const folderResult = await this.userFolderService.findCustomFolderName(
          n.user_folder_id
        );
        folderName = folderResult.folder_name;
      }
      //이룬 위시면 날짜 나오기
      if (n.finish_active) {
        finish_day = n.finish_day;
      } else {
        finish_day = false;
      }
      return {
        folderName,
        context: n.context,
        createdAt: n.created_at,
        finishDay: finish_day,
      };
    });

    // return Promise.all(result);
    const sortedResult = await Promise.all(result);

    //날짜 내림차순
    sortedResult.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedResult;
  }
  /**
   * 각 폴더에서 이룬 위시 갯수 오름차순
   */
  async finishUserCardCount(user_id: number) {
    const query = this.userCardRepository
      .createQueryBuilder("uc")
      .select("uc.default_folder_id", "default_folder_id")
      .addSelect("uc.user_folder_id", "user_folder_id")
      .addSelect("COUNT(*)", "count")
      .where("uc.user_id = :user_id", { user_id })
      .groupBy("uc.default_folder_id")
      .addGroupBy("uc.user_folder_id")
      .orderBy("count", "DESC");

    const queryAllCount = this.userCardRepository
      .createQueryBuilder("uc")
      .select("COUNT(*)", "count")
      .where("uc.user_id= :user_id", { user_id });

    let findResult;
    const queryResult = (await query.getRawMany()).map(async (n) => {
      if (n.default_folder_id) {
        findResult = (
          await this.userFolderService.findDefaultFolderName(
            n.default_folder_id
          )
        ).folder_name;
      } else {
        findResult = (
          await this.userFolderService.findCustomFolderName(n.user_folder_id)
        ).folder_name;
      }

      return { folder_name: findResult, count: n.count };
    });

    return {
      total_count: await queryAllCount.getRawMany(),
      folder_of_count: await Promise.all(queryResult),
    };
  }
}
