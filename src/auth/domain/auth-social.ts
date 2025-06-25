import { DomainEntity, UUID } from "src/common";
import { SocialCodeVO } from "./social-code.vo";

interface AuthSocialProps {
  externalId: string;
  socialCode: SocialCodeVO;
  userId: UUID;
}

interface CreateAuthSocialProps {
  externalId: string;
  socialCode: SocialCodeVO;
  userId: string;
}

export class AuthSocial extends DomainEntity<UUID, AuthSocialProps> {
  static create(props: CreateAuthSocialProps) {
    return new AuthSocial({
      id: UUID.create(),
      props: {
        externalId: props.externalId,
        socialCode: props.socialCode,
        userId: UUID.create(props.userId),
      },
    });
  }

  validate() {
    if (!this.id) {
      throw new Error("ID 존재하지 않습니다.");
    }
    if (!this.props.externalId) {
      throw new Error("External ID 존재하지 않습니다.");
    }
    if (
      this.props.externalId.length < 1 ||
      this.props.externalId.length > 255
    ) {
      throw new Error("External ID  1 ~ 255 자 사이여야 합니다.");
    }
    if (!(this.props.socialCode instanceof SocialCodeVO)) {
      throw new Error("socialCode는 SocialCodeVO 인스턴스여야 합니다.");
    }
    if (!this.props.userId) {
      throw new Error("User ID 존재하지 않습니다.");
    }
  }
}
