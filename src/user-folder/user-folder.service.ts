import { Injectable } from "@nestjs/common";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { Repository } from "typeorm";
import { UserFolderEntity } from "./entities/user-folder.entity";

@Injectable()
export class UserFolderService {
  constructor(
    @InjectRepository(DefaultFolderEntity)
    private readonly defaultRepository: Repository<DefaultFolderEntity>,

    @InjectRepository(UserFolderEntity)
    private readonly newUserFolderRepository: Repository<UserFolderEntity>
  ) {}

  /**
   * 폴더 생성
   * @param folder_name 폴더명
   * @returns
   */
  async createCustomUserFolder(folder_name: string) {
    const saveResult = await this.newUserFolderRepository.save(
      new UserFolderEntity({
        folder_name: folder_name,
        user_id: 3,
      })
    );

    return saveResult;
  }

  /**
   * 폴더명 수정
   * @param dto
   * @returns
   */
  async updateCustomUserFolder(dto: UpdateUserFolderDto) {
    const saveResult = await this.newUserFolderRepository.update(
      dto.folder_id,
      {
        folder_name: dto.folder_name,
      }
    );

    return saveResult;
  }

  /**
   * 폴더 삭제
   * @param folder_id
   * @returns
   */
  async deleteCustomUserFolder(folder_id: number) {
    const deleteResult = await this.newUserFolderRepository.delete(folder_id);

    return deleteResult;
  }

  async getAllUserFoler() {
    const findDefaultFolder = await this.defaultRepository.find();

    const findCustomFolder = await this.newUserFolderRepository.find({
      where: {
        user_id: 3,
      },
      order: {
        id: "ASC",
      },
    });

    return { findDefaultFolder, findCustomFolder };
  }
}
