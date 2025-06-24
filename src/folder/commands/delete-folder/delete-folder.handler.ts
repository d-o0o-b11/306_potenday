import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteFolderCommand } from "./delete-folder.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Folder } from "src/database";

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderCommandHandler
  implements ICommandHandler<DeleteFolderCommand>
{
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const { userId, folderId } = command;

    const deleteResult = await this.manager.delete(Folder, {
      id: folderId,
      userId,
    });

    if (!deleteResult.affected) {
      throw new Error(
        `Folder with ID ${folderId} not found for user ${userId}`
      );
    }
  }
}
