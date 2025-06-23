import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InfoQuery } from "./info.query";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { User } from "src/database";
import { InfoResponseDto } from "./info.dto";

@QueryHandler(InfoQuery)
export class InfoQueryHandler implements IQueryHandler<InfoQuery> {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(query: InfoQuery): Promise<InfoResponseDto> {
    const user = await this.manager.findOne(User, {
      where: {
        id: query.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      emailActive: user.emailActive,
      profile: user.profile,
    };
  }
}
