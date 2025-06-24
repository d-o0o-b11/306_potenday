import { UUID } from "src/common";
import { Card as CardEntity } from "src/database";
import { Card } from "../domains";

export class CardMapper {
  static toPersistence(card: Card): CardEntity {
    const props = card.getProps();

    const entity = new CardEntity();
    entity.id = card.id.unpack();
    entity.title = props.title;
    entity.context = props.context;
    entity.top = props.top;
    entity.left = props.left;
    entity.folderId = props.folderId.unpack();
    entity.userId = props.userId.unpack();
    entity.finishDate = props.finishDate;
    entity.foldedState = props.foldedState;

    return entity;
  }

  static toDomain(entity: CardEntity): Card {
    return new Card({
      id: UUID.create(entity.id),
      props: {
        title: entity.title,
        context: entity.context,
        top: entity.top,
        left: entity.left,
        folderId: UUID.create(entity.folderId),
        userId: UUID.create(entity.userId),
        finishDate: entity.finishDate,
        foldedState: entity.foldedState,
      },
    });
  }
}
