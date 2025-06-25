import { AuthSocialMapper } from "../../mappers";
import { AuthSocial, SocialCodeVO } from "../../domain";
import { UUID } from "src/common";
import { AuthSocial as AuthSocialEntity } from "src/database";

const createValidAuthSocialDomain = (): AuthSocial => {
  return AuthSocial.create({
    externalId: "external-id",
    socialCode: SocialCodeVO.KAKAO,
    userId: UUID.create().unpack(),
  });
};

describe("AuthSocialMapper", () => {
  describe("toPersistence", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = createValidAuthSocialDomain();
      const props = domain.getProps();

      const entity = AuthSocialMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(AuthSocialEntity);
      expect(entity.id).toBe(domain.id.unpack());
      expect(entity.externalId).toBe(props.externalId);
      expect(entity.socialCode).toBe(props.socialCode.value);
      expect(entity.userId).toBe(props.userId.unpack());
    });
  });

  describe("toDomain", () => {
    it("엔티티를 도메인 객체로 변환한다", () => {
      const domain = createValidAuthSocialDomain();
      const props = domain.getProps();

      const entity = new AuthSocialEntity();
      entity.id = domain.id.unpack();
      entity.externalId = props.externalId;
      entity.socialCode = props.socialCode.value;
      entity.userId = props.userId.unpack();

      const result = AuthSocialMapper.toDomain(entity);
      const resultProps = result.getProps();

      expect(result).toBeInstanceOf(AuthSocial);
      expect(result.id.equals(domain.id)).toBe(true);
      expect(resultProps.externalId).toBe(entity.externalId);
      expect(resultProps.socialCode.value).toBe(entity.socialCode);
      expect(resultProps.userId.unpack()).toBe(entity.userId);
    });
  });
});
