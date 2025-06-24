import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCardCommand } from "./create-card.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Card } from "src/card/domains";
import { CardMapper } from "src/card/mappers";
import { Card as CardEntity } from "src/database";

@CommandHandler(CreateCardCommand)
export class CreateCardCommandHandler
  implements ICommandHandler<CreateCardCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: CreateCardCommand): Promise<void> {
    const { title, context, top, left, folderId, userId } = command;

    await this.manager.insert(
      CardEntity,
      CardMapper.toPersistence(
        Card.create({
          title,
          context,
          top,
          left,
          folderId,
          userId,
        })
      )
    );
  }
}
