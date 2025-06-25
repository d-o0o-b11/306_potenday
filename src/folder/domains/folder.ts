import { DomainEntity, UUID } from "src/common";

export interface FolderProps {
  name: string;
  widthName: string;
  heightName: string;
  userId: UUID;
}

export interface CreateFolderProps {
  name: string;
  widthName: string;
  heightName: string;
  userId: string;
}

export class Folder extends DomainEntity<UUID, FolderProps> {
  static create(props: CreateFolderProps): Folder {
    return new Folder({
      id: UUID.create(),
      props: {
        name: props.name,
        widthName: props.widthName,
        heightName: props.heightName,
        userId: UUID.create(props.userId),
      },
    });
  }

  validate(): void {
    if (!this.id) {
      throw new Error("ID 존재하지 않습니다.");
    }

    if (
      !this.props.name ||
      this.props.name.length < 1 ||
      this.props.name.length > 20
    ) {
      throw new Error("Folder 이름은 1~20자 사이여야 합니다.");
    }

    if (
      !this.props.widthName ||
      this.props.widthName.length < 1 ||
      this.props.widthName.length > 10
    ) {
      throw new Error("가로 축 이름은 1~10자 사이여야 합니다.");
    }

    if (
      !this.props.heightName ||
      this.props.heightName.length < 1 ||
      this.props.heightName.length > 10
    ) {
      throw new Error("세로 축 이름은 1~10자 사이여야 합니다.");
    }

    if (!this.props.userId) {
      throw new Error("User ID 존재하지 않습니다.");
    }
  }

  updateInfo(props: {
    name?: string;
    widthName?: string;
    heightName?: string;
  }) {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }
    if (props.widthName !== undefined) {
      this.props.widthName = props.widthName;
    }
    if (props.heightName !== undefined) {
      this.props.heightName = props.heightName;
    }

    this.validate();
  }
}
