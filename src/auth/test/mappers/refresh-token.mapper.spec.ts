import { RefreshTokenMapper } from "../../mappers";
import { RefreshToken } from "../../domain";
import { UUID } from "src/common";
import { RefreshToken as RefreshTokenEntity } from "src/database";

const createValidRefreshTokenDomain = (): RefreshToken => {
  return RefreshToken.create({
    userId: UUID.create().unpack(),
    token: "test-refresh-token",
    sessionId: UUID.create().unpack(),
    expiredAt: "1h",
  });
};

describe("RefreshTokenMapper", () => {
  describe("toPersistence", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = createValidRefreshTokenDomain();
      const props = domain.getProps();

      const entity = RefreshTokenMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(RefreshTokenEntity);
      expect(entity.id).toBe(domain.id.unpack());
      expect(entity.userId).toBe(props.userId.unpack());
      expect(entity.token).toBe(props.token);
      expect(entity.sessionId).toBe(props.sessionId.unpack());
      expect(entity.expiredAt.getTime()).toBe(props.expiredAt.getTime());
    });
  });

  describe("toDomain", () => {
    it("엔티티를 도메인 객체로 변환한다", () => {
      const domain = createValidRefreshTokenDomain();
      const props = domain.getProps();

      const entity = new RefreshTokenEntity();
      entity.id = domain.id.unpack();
      entity.userId = props.userId.unpack();
      entity.token = props.token;
      entity.sessionId = props.sessionId.unpack();
      entity.expiredAt = props.expiredAt;

      const result = RefreshTokenMapper.toDomain(entity);
      const resultProps = result.getProps();

      expect(result).toBeInstanceOf(RefreshToken);
      expect(result.id.equals(domain.id)).toBe(true);
      expect(resultProps.userId.unpack()).toBe(entity.userId);
      expect(resultProps.token).toBe(entity.token);
      expect(resultProps.sessionId.unpack()).toBe(entity.sessionId);
      expect(resultProps.expiredAt.getTime()).toBe(entity.expiredAt.getTime());
    });
  });
});
