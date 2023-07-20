import { DeleteResult, UpdateResult } from "typeorm";
import { CreateUserCardDto } from "../dto/create-user-card.dto";
import { UpdateUserCardDto } from "../dto/update-user-card.dto";
import { UserCardEntity } from "../entities/user-card.entity";
import { FindAllUserCardDto } from "../dto/findAll-card.dto";

export const USER_CARD_TOKEN = Symbol("UserCardInterface");

export interface UserCardInterface {
  /**
   * 처음엔 제목, 내용 빈값으로 들어옵니다.
   * @param dto 생성할 유저 카드
   * @param user_id 유저 id
   */
  createUserCard(
    dto: CreateUserCardDto,
    user_id: number
  ): Promise<UserCardEntity>;

  /**
   * 카드의 내용 or 위치를 수정합니다.
   * @param dto 카드 변경 내용
   */
  updateUserCard(dto: UpdateUserCardDto): Promise<UpdateResult>;

  /**
   * 카드가 접힌 상태로 or 열린 상태로 수정합니다.
   * @param card_id
   */
  updateUserCardFolderState(card_id: number): Promise<UpdateResult>;

  /**
   * 해당 폴더에 있는 모든 위시 카드 출력합니다. << 생성된 폴더 id로 오름차순 >>
   * 달선한 카드는 제외하고 출력합니다.
   * @param dto
   * @param user_id
   */
  findUserCardOfFolder(
    dto: FindAllUserCardDto,
    user_id: number
  ): Promise<UserCardEntity[]>;

  /**
   * 위시카드 위시한 상태로 수정합니다.
   * @param card_id
   */
  finishUserCard(card_id: number): Promise<UpdateResult>;

  /**
   * 위시카드 삭제합니다.
   * @param card_id
   */
  deleteUserCard(card_id: number): Promise<DeleteResult>;

  /**
   * 사용자가 생성한 모든 카드를 출력합니다.
   * 메인 화면 표에 들어갈 내용들 입니다.
   * @param user_id
   */
  findAllUserCard(user_id: number): Promise<
    {
      folderName: string;
      title: string;
      createdAt: Date;
      finishDay: boolean | Date;
    }[]
  >;

  /**
   * 위시 카드 제목을 이용해서 검색을 합니다.
   * @param user_id
   * @param search_word 제목
   */
  searchAllUserCard(
    user_id: number,
    search_word: string
  ): Promise<
    {
      folderName: string;
      title: string;
      createdAt: Date;
      finishDay: boolean | Date;
    }[]
  >;

  /**
   * 위시한(달성한) 카드 갯수 순으로 출력합니다.
   * 전체 위시카드 갯수 , 미완주 위시카드 갯수 , 카드 갯수 많은 순으로 2개만 {폴더명, 총 위시카드 갯수, 미완주 위시카드 갯수}
   * 위시카드 0개인 경우 => 폴더 순으로 2개 출력
   * 위시카드 1개인 경우 => 그 폴더를 제외하고 폴더 순으로 제일 위에 있는거 1개 출력
   * @param user_id
   */
  finishUserCardCount(user_id: number): Promise<{
    total_count: any[];
    unfinished_count: any[];
    folder_of_count: {
      folder_name: any;
      total_count: any;
      unfinished_count: any;
    }[];
  }>;
}
