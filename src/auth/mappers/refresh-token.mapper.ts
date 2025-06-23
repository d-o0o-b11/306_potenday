import { UUID } from "src/common";
import { RefreshToken } from "../domain";
import { RefreshToken as RefreshTokenEntity } from "src/database";

export class RefreshTokenMapper {
  static toPersistence(refreshToken: RefreshToken): RefreshTokenEntity {
    const props = refreshToken.getProps();

    const entity = new RefreshTokenEntity();
    entity.id = refreshToken.id.unpack();
    entity.userId = props.userId.unpack();
    entity.token = props.token;
    entity.sessionId = props.sessionId.unpack();
    entity.expiredAt = props.expiredAt;

    return entity;
  }

  static toDomain(entity: RefreshTokenEntity): RefreshToken {
    return new RefreshToken({
      id: UUID.create(entity.id),
      props: {
        userId: UUID.create(entity.userId),
        token: entity.token,
        sessionId: UUID.create(entity.sessionId),
        expiredAt: entity.expiredAt,
      },
    });
  }
}
