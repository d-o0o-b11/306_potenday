import { Injectable } from "@nestjs/common";
import { CreateUserCardDto } from "./dto/create-user-card.dto";
import { UpdateUserCardDto } from "./dto/update-user-card.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCardEntity } from "./entities/user-card.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserCardService {
  constructor(
    @InjectRepository(UserCardEntity)
    private readonly userCardRepository: Repository<UserCardEntity>
  ) {}

  async createUserCard(dto: CreateUserCardDto) {
    const saveResult = await this.userCardRepository.save(
      new UserCardEntity({
        top: dto.top,
        left: dto.left,
        title: dto.title,
        context: dto.context,
        default_folder_id: dto?.default_folder_id || undefined,
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
  async findUserCardOfFolder(folder_id: number) {
    const findResult = await this.userCardRepository.find({
      where: {
        default_folder_id: folder_id,
      },
    });
    return findResult;
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
}
