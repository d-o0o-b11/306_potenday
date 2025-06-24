import { DomainEntity, UUID } from "src/common";

export interface CardProps {
  title: string;
  context: string;
  top: number;
  left: number;
  folderId: UUID;
  userId: UUID;
  finishDate: Date | null;
  foldedState: boolean;
}

export interface CreateCardProps {
  title: string;
  context: string;
  top: number;
  left: number;
  folderId: string;
  userId: string;
  finishDate?: Date | null;
  foldedState?: boolean;
}

export class Card extends DomainEntity<UUID, CardProps> {
  static create(props: CreateCardProps): Card {
    return new Card({
      id: UUID.create(),
      props: {
        title: props.title,
        context: props.context,
        top: props.top,
        left: props.left,
        folderId: UUID.create(props.folderId),
        userId: UUID.create(props.userId),
        finishDate: props.finishDate ?? null,
        foldedState: props.foldedState ?? false,
      },
    });
  }

  validate(): void {
    if (!this.id) throw new Error("ID가 존재하지 않습니다.");

    const { title, context, top, left, folderId, userId } = this.props;

    if (!title || title.length < 1 || title.length > 20) {
      throw new Error("카드 제목은 1~20자 사이여야 합니다.");
    }

    if (!context || context.length < 1 || context.length > 100) {
      throw new Error("카드 내용은 1~100자 사이여야 합니다.");
    }

    if (typeof top !== "number" || typeof left !== "number") {
      throw new Error("top, left는 숫자여야 합니다.");
    }

    if (!folderId) throw new Error("Folder ID가 존재하지 않습니다.");
    if (!userId) throw new Error("User ID가 존재하지 않습니다.");
  }

  updateInfo(props: {
    title?: string;
    context?: string;
    top?: number;
    left?: number;
    foldedState?: boolean;
  }) {
    if (props.title !== undefined) this.props.title = props.title;
    if (props.context !== undefined) this.props.context = props.context;
    if (props.top !== undefined) this.props.top = props.top;
    if (props.left !== undefined) this.props.left = props.left;

    if (props.foldedState !== undefined)
      this.props.foldedState = props.foldedState;

    this.validate();
  }

  updateFinishDate(status: boolean) {
    if (status) {
      this.props.finishDate = new Date();
    } else {
      this.props.finishDate = null;
    }

    this.validate();
  }
}
