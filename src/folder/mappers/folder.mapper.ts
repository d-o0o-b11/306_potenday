import { UUID } from "src/common";
import { Folder as FolderEntity } from "src/database";
import { Folder } from "../domains";

export class FolderMapper {
  static toPersistence(folder: Folder): FolderEntity {
    const props = folder.getProps();

    const entity = new FolderEntity();
    entity.id = folder.id.unpack();
    entity.name = props.name;
    entity.widthName = props.widthName;
    entity.heightName = props.heightName;
    entity.userId = props.userId.unpack();

    return entity;
  }

  static toDomain(entity: FolderEntity): Folder {
    return new Folder({
      id: UUID.create(entity.id),
      props: {
        name: entity.name,
        widthName: entity.widthName,
        heightName: entity.heightName,
        userId: UUID.create(entity.userId),
      },
    });
  }
}
