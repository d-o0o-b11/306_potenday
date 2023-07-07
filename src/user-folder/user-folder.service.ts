import { Injectable } from "@nestjs/common";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { UserFolderEntity } from "./entities/user-folder.entity";
import { UpdateAxisDto } from "./dto/update-axis.dto";
import { UserFolderInterface } from "./interface/user-folder.interface";

@Injectable()
export class UserFolderService implements UserFolderInterface {
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
  async createCustomUserFolder(
    folder_name: string,
    user_id: number
  ): Promise<UserFolderEntity> {
    const saveResult = await this.newUserFolderRepository.save(
      new UserFolderEntity({
        folder_name: folder_name,
        user_id: user_id,
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
  async updateCustomUserFolder(
    dto: UpdateUserFolderDto
  ): Promise<UpdateResult> {
    const saveResult = await this.newUserFolderRepository.update(
      dto.folder_id,
      {
        folder_name: dto.folder_name,
      }
    );

    if (!saveResult.affected) {
      throw new Error("폴더명 수정 실패");
    }

    return saveResult;
  }

  async getAllUserFoler(user_id: number): Promise<{
    findDefaultFolder: DefaultFolderEntity[];
    findCustomFolder: UserFolderEntity[];
  }> {
    const findDefaultFolder = await this.defaultRepository.find({
      order: {
        id: "ASC",
      },
    });

    const findCustomFolder = await this.newUserFolderRepository.find({
      where: {
        user_id: user_id,
      },
      order: {
        id: "ASC",
      },
    });

    return { findDefaultFolder, findCustomFolder };
  }

  /**
   * 폴더 삭제
   * @param folder_id
   * @returns
   */
  async deleteCustomUserFolder(folder_id: number): Promise<DeleteResult> {
    const deleteResult = await this.newUserFolderRepository.delete(folder_id);

    if (!deleteResult.affected) {
      throw new Error("폴더 삭제 실패");
    }

    return deleteResult;
  }

  /**
   * 가로, 세로축 명 수정
   */
  async updateHorizontalVerticalAxis(
    dto: UpdateAxisDto
  ): Promise<UpdateResult> {
    const { folder_id, width, height } = dto;

    const updateResult = await this.newUserFolderRepository.update(folder_id, {
      width: width,
      height: height,
    });

    if (!updateResult.affected) {
      throw new Error("폴더 축 이름 설정 실패");
    }

    return updateResult;
  }

  /**
   * folder_id를 이용해서
   * 기본 생성 폴더명 가져오기
   */
  async findDefaultFolderName(folder_id: number): Promise<DefaultFolderEntity> {
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
  async findCustomFolderName(folder_id: number): Promise<UserFolderEntity> {
    const findResult = await this.newUserFolderRepository.findOne({
      where: {
        id: folder_id,
      },
    });
    return findResult;
  }
}
