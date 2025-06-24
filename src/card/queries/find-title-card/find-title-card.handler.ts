import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EntityManager, Like } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Card } from "src/database";
import { FindTitleCardResponseDto } from "./find-title-card.dto";
import { FindTitleCardQuery } from "./find-title-card.query";

@QueryHandler(FindTitleCardQuery)
export class FindTitleCardQueryHandler
  implements IQueryHandler<FindTitleCardQuery>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(
    query: FindTitleCardQuery
  ): Promise<FindTitleCardResponseDto[]> {
    const { title, userId } = query;

    const result = await this.manager.find(Card, {
      where: {
        title: Like(`%${title}%`),
        userId: userId,
      },
      order: {
        createdAt: "ASC",
      },
      relations: {
        folder: true,
      },
      select: {
        title: true,
        createdAt: true,
        finishDate: true,
        folder: {
          name: true,
        },
      },
    });

    return result.map((card) => ({
      folderName: card.folder.name,
      title: card.title,
      createdAt: card.createdAt,
      finishDate: card.finishDate,
    }));
  }
}
