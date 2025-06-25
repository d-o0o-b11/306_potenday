import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateStatusCardCommand } from "./update-status-card.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Card as CardEntity } from "src/database";
import { CardMapper } from "src/card/mappers";

@CommandHandler(UpdateStatusCardCommand)
export class UpdateStatusCardCommandHandler
  implements ICommandHandler<UpdateStatusCardCommand>
{
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async execute(command: UpdateStatusCardCommand): Promise<void> {
    const { cardId, userId, status } = command;

    const findCard = await this.manager.findOne(CardEntity, {
      where: {
        id: cardId,
        userId,
      },
    });

    if (!findCard) {
      throw new Error("존재하지 않는 카드입니다.");
    }

    const card = CardMapper.toDomain(findCard);
    card.updateFinishDate(status);

    const updateResult = await this.manager.update(
      CardEntity,
      cardId,
      CardMapper.toPersistence(card)
    );

    if (!updateResult.affected) {
      throw new Error("카드 완료 상태 업데이트에 실패했습니다.");
    }
  }
}
