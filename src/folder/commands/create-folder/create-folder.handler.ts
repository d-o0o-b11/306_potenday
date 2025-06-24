import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateFolderCommand } from "./create-folder.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Folder as FolderEntity } from "src/database";
import { Folder } from "../../domains";
import { FolderMapper } from "src/folder/mappers";

@CommandHandler(CreateFolderCommand)
export class CreateFolderCommandHandler
  implements ICommandHandler<CreateFolderCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: CreateFolderCommand): Promise<void> {
    const { userId, name, widthName, heightName } = command;

    await this.manager.insert(
      FolderEntity,
      FolderMapper.toPersistence(
        Folder.create({
          name,
          widthName,
          heightName,
          userId,
        })
      )
    );
  }
}
