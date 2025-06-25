import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateDefaultFolderEvent } from "src/common";
import { Folder as FolderEntity } from "src/database";
import { EntityManager } from "typeorm";
import { Folder } from "../domains";
import { FolderMapper } from "../mappers";
import { DefaultFolderList } from "../constants";

@EventsHandler(CreateDefaultFolderEvent)
export class CreateDefaultFolderEventHandler
  implements IEventHandler<CreateDefaultFolderEvent>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async handle(event: CreateDefaultFolderEvent) {
    const { userId } = event.props;

    await this.manager.insert(
      FolderEntity,
      DefaultFolderList.map(({ name, widthName, heightName }) => {
        const defaultFolder = Folder.create({
          name,
          widthName,
          heightName,
          userId,
        });
        return FolderMapper.toPersistence(defaultFolder);
      })
    );
  }
}
