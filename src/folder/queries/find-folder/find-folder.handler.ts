import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindFolderQuery } from "./find-folder.query";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Folder } from "src/database";
import { FindFolderResponseDto } from "./find-folder.dto";

@QueryHandler(FindFolderQuery)
export class FindFolderQueryHandler implements IQueryHandler<FindFolderQuery> {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(query: FindFolderQuery): Promise<FindFolderResponseDto[]> {
    const { userId } = query;

    const folderList = await this.manager.find(Folder, {
      where: { userId },
      order: { createdAt: "ASC" },
    });

    return folderList.map((folder) => ({
      folderId: folder.id,
      name: folder.name,
      widthName: folder.widthName,
      heightName: folder.heightName,
    }));
  }
}
