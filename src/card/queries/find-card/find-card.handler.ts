import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindCardQuery } from "./find-card.query";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Card } from "src/database";
import { FindCardResponseDto } from "./find-card.dto";

@QueryHandler(FindCardQuery)
export class FindCardQueryHandler implements IQueryHandler<FindCardQuery> {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async execute(query: FindCardQuery): Promise<FindCardResponseDto[]> {
    const { userId } = query;

    const result = await this.manager.find(Card, {
      where: {
        userId: userId,
      },
      order: {
        createdAt: "ASC",
      },
    });

    return result.map((card) => ({
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
