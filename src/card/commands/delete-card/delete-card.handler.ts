import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCardCommand } from "./delete-card.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Card } from "src/database";

@CommandHandler(DeleteCardCommand)
export class DeleteCardCommandHandler
  implements ICommandHandler<DeleteCardCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: DeleteCardCommand): Promise<void> {
    const { cardId, userId } = command;

    const deleteResult = await this.manager.delete(Card, {
      id: cardId,
      userId: userId,
    });

    if (!deleteResult.affected) {
      throw new Error(`Card with ID ${cardId} not found for user ${userId}`);
    }
  }
}
