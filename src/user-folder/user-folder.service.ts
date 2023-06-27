import { Injectable } from "@nestjs/common";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { Repository } from "typeorm";
import { UserFolderEntity } from "./entities/user-folder.entity";
import { UpdateAxisDto } from "./dto/update-axis.dto";

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
        width: "시급도",
        height: "중요도",
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

  /**
   * 가로, 세로축 명 수정
   */
  async updateHorizontalVerticalAxis(dto: UpdateAxisDto) {
    const { folder_id, width, height } = dto;

    const updateResult = await this.newUserFolderRepository.update(folder_id, {
      width: width,
      height: height,
    });

    return updateResult;
  }

  /**
   * folder_id를 이용해서
   * 기본 생성 폴더명 가져오기
   */
  async findDefaultFolderName(folder_id: number) {
    const findResult = await this.defaultRepository.findOne({
      where: {
        id: folder_id,
      },
    });
    return findResult;
  }

  /**
   * folder_id를 이용해서
   * 사용자가 생성한 폴더명 가져오기
   */
  async findCustomFolderName(folder_id: number) {
    const findResult = await this.newUserFolderRepository.findOne({
      where: {
        id: folder_id,
      },
    });
    return findResult;
  }
}
