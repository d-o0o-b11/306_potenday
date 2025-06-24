import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateCardCommand } from "./update-card.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Card as CardEntity } from "src/database";
import { CardMapper } from "src/card/mappers";
import { UpdateCardResponseDto } from "./update-card.dto";

@CommandHandler(UpdateCardCommand)
export class UpdateCardCommandHandler
  implements ICommandHandler<UpdateCardCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: UpdateCardCommand): Promise<UpdateCardResponseDto> {
    const { cardId, userId, title, context, top, left, foldedState } = command;

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
    card.updateInfo({
      title,
      context,
      top,
      left,
      foldedState,
    });

    const updateResult = await this.manager.update(
      CardEntity,
      cardId,
      CardMapper.toPersistence(card)
    );

    if (!updateResult.affected) {
      throw new Error("카드 업데이트에 실패했습니다.");
    }

    const result = await this.manager.findOne(CardEntity, {
      where: {
        id: cardId,
        userId,
      },
    });

    return {
      cardId: result.id,
      title: result.title,
      context: result.context,
      top: result.top,
      left: result.left,
      finishDate: result.finishDate,
      foldedState: result.foldedState,
    };
  }
}
