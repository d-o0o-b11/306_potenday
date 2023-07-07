import { DeleteResult, UpdateResult } from "typeorm";
import { UpdateUserFolderDto } from "../dto/update-user-folder.dto";
import { UserFolderEntity } from "../entities/user-folder.entity";
import { DefaultFolderEntity } from "../entities/default-folder.entity";
import { UpdateAxisDto } from "../dto/update-axis.dto";

export interface UserFolderInterface {
  /**
   * 기본으로 제공되는 폴더가 아닌 사용자가 생성하는 폴더
   * @param folder_name custom_folder_name
   * @param user_id
   */
  createCustomUserFolder(
    folder_name: string,
    user_id: number
  ): Promise<UserFolderEntity>;

  /**
   * custome 폴더 명 수정
   * @param dto
   */
  updateCustomUserFolder(dto: UpdateUserFolderDto): Promise<UpdateResult>;

  /**
   * 유저가 소지하고 있는 모든 폴더명들 출력
   * @param user_id
   */
  getAllUserFoler(user_id: number): Promise<{
    findDefaultFolder: DefaultFolderEntity[];
    findCustomFolder: UserFolderEntity[];
  }>;

  /**
   * custom 폴더 삭제 => 연관된 카드들 모두 삭제됩니다
   * @param folder_id
   */
  deleteCustomUserFolder(folder_id: number): Promise<DeleteResult>;

  /**
   * 해당 폴더의 가로, 세로축 명 수정
   * @param dto folder_id, width, height
   */
  updateHorizontalVerticalAxis(dto: UpdateAxisDto): Promise<UpdateResult>;

  /**
   * 폴더 id 를 이용해서 해당 폴더명을 찾을 수 있습니다. << Defalut >>
   * @param folder_id
   */
  findDefaultFolderName(folder_id: number): Promise<DefaultFolderEntity>;

  /**
   * 폴더 id를 이용해서 해당 폴더명을 찾을 수 있습니다. << Custom >>
   * @param folder_id
   */
  findCustomFolderName(folder_id: number): Promise<UserFolderEntity>;
}
