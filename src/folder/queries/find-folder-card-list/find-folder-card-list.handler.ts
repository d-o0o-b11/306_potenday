import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindFolderCardListQuery } from "./find-folder-card-list.query";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Card } from "src/database";
import { FindFolderCardListResponseDto } from "./find-folder-card-list.dto";

@QueryHandler(FindFolderCardListQuery)
export class FindFolderCardListQueryHandler
  implements IQueryHandler<FindFolderCardListQuery>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(
    query: FindFolderCardListQuery
  ): Promise<FindFolderCardListResponseDto[]> {
    const { userId, folderId } = query;

    const cards = await this.manager.find(Card, {
      where: {
        userId,
        folderId,
      },
      order: { createdAt: "ASC" },
    });

    return cards.map((card) => ({
      cardId: card.id,
      title: card.title,
      context: card.context,
      top: card.top,
      left: card.left,
      finishDate: card.finishDate,
      foldedState: card.foldedState,
    }));
  }
}
