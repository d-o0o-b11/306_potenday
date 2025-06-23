import { DomainEntity, UUID } from "src/common";
import * as ms from "ms";

interface RefreshTokenProps {
  userId: UUID;
  token: string;
  sessionId: UUID;
  expiredAt: Date;
}

interface CreaTeRefreshTokenProps {
  userId: string;
  token: string;
  sessionId: string;
  expiredAt: string;
}

export class RefreshToken extends DomainEntity<UUID, RefreshTokenProps> {
  static create(props: CreaTeRefreshTokenProps): RefreshToken {
    return new RefreshToken({
      id: UUID.create(),
      props: {
        userId: UUID.create(props.userId),
        token: props.token,
        sessionId: UUID.create(props.sessionId),
        expiredAt: new Date(Date.now() + ms(props.expiredAt)),
      },
    });
  }

  validate() {
    if (!this.id) {
      throw new Error("ID 존재하지 않습니다.");
    }
    if (!this.props.userId) {
      throw new Error("User ID 존재하지 않습니다.");
    }

    if (
      !this.props.token ||
      this.props.token.length < 1 ||
      this.props.token.length > 255
    ) {
      throw new Error("Token 1 ~ 255 자 사이여야 합니다.");
    }
    if (!this.props.sessionId) {
      throw new Error("Session ID 존재하지 않습니다.");
    }
    if (this.props.expiredAt.getTime() < Date.now()) {
      throw new Error("Expired At은 현재 시점 이후여야 합니다.");
    }
  }
}
