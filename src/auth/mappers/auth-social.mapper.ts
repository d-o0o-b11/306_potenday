import { UUID } from "src/common";
import { AuthSocial, SocialCodeVO } from "../domain";
import { AuthSocial as AuthSocialEntity } from "src/database";

export class AuthSocialMapper {
  static toPersistence(authSocial: AuthSocial): AuthSocialEntity {
    const props = authSocial.getProps();

    const entity = new AuthSocialEntity();
    entity.id = authSocial.id.unpack();
    entity.externalId = props.externalId;
    entity.socialCode = props.socialCode.value; // VO 사용
    entity.userId = props.userId.unpack();

    return entity;
  }

  static toDomain(entity: AuthSocialEntity): AuthSocial {
    return new AuthSocial({
      id: UUID.create(entity.id),
      props: {
        externalId: entity.externalId,
        socialCode: SocialCodeVO.create(entity.socialCode),
        userId: UUID.create(entity.userId),
      },
    });
  }
}
