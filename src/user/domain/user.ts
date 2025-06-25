import { DomainEntity, UUID } from "src/common";

interface UserProps {
  name: string;
  email: string;
  profile: string;
  emailActive?: boolean;
}

export class User extends DomainEntity<UUID, UserProps> {
  static create(props: UserProps): User {
    return new User({
      id: UUID.create(),
      props: {
        name: props.name,
        email: props.email,
        profile: props.profile,
        emailActive: props.emailActive ?? true, // 기본값은 true로 설정
      },
    });
  }

  validate() {
    if (!this.id) {
      throw new Error("ID 존재하지 않습니다.");
    }
    if (
      !this.props.name ||
      this.props.name.length < 1 ||
      this.props.name.length > 10
    ) {
      throw new Error("Name 1 ~ 10 자 사이여야 합니다.");
    }
    if (
      !this.props.email ||
      this.props.email.length < 1 ||
      this.props.email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.props.email)
    ) {
      throw new Error(
        "Email은 1 ~ 255 자 사이의 유효한 이메일 형식이어야 합니다."
      );
    }
    if (!this.props.profile) {
      throw new Error("Profile 존재하지 않습니다.");
    }
  }

  updateInfo(props: { name?: string; email?: string; emailActive?: boolean }) {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }
    if (props.email !== undefined) {
      this.props.email = props.email;
    }
    if (props.emailActive !== undefined) {
      this.props.emailActive = props.emailActive;
    }

    // 변경된 상태가 유효한지 검증
    this.validate();
  }
}
