import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateFolderCommand } from "./update-folder.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Folder as FolderEntity } from "src/database";
import { FolderMapper } from "src/folder/mappers";
import { UpdateFolderResponseDto } from "./update-folder.dto";

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderCommandHandler
  implements ICommandHandler<UpdateFolderCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(
    command: UpdateFolderCommand
  ): Promise<UpdateFolderResponseDto> {
    const { userId, folderId, name, widthName, heightName } = command;

    const findFolder = await this.manager.findOne(FolderEntity, {
      where: {
        id: folderId,
        userId,
      },
    });

    if (!findFolder) {
      throw new Error("존재하지 않는 폴더입니다.");
    }

    const folder = FolderMapper.toDomain(findFolder);
    folder.updateInfo({
      name,
      widthName,
      heightName,
    });

    const updateResult = await this.manager.update(
      FolderEntity,
      folderId,
      FolderMapper.toPersistence(folder)
    );

    if (!updateResult.affected) {
      throw new Error("폴더 업데이트에 실패했습니다.");
    }

    const result = await this.manager.findOne(FolderEntity, {
      where: {
        id: folderId,
        userId,
      },
    });

    return {
      folderId: result.id,
      name: result.name,
      widthName: result.widthName,
      heightName: result.heightName,
    };
  }
}
