import { AuthSocial, SocialCodeVO } from "src/auth/domain";
import { UUID } from "src/common";
import copy from "fast-copy";

describe("AuthSocial", () => {
  const validProps = {
    externalId: "social-123",
    socialCode: SocialCodeVO.KAKAO,
    userId: UUID.create().unpack(),
  };

  describe("create", () => {
    it("정상적으로 AuthSocial을 생성한다", () => {
      const authSocial = AuthSocial.create(validProps);

      expect(authSocial).toBeInstanceOf(AuthSocial);
      expect(authSocial.id).toBeInstanceOf(UUID);
      expect(authSocial.getProps().externalId).toEqual(validProps.externalId);
      expect(authSocial.getProps().socialCode).toBeInstanceOf(SocialCodeVO);
      expect(authSocial.getProps().userId).toBeInstanceOf(UUID);
    });
  });

  describe("validate", () => {
    it("externalId가 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.externalId = "";
      expect(() => AuthSocial.create(p)).toThrow(
        "External ID 존재하지 않습니다."
      );
    });

    it("externalId가 256자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.externalId = "a".repeat(256);
      expect(() => AuthSocial.create(p)).toThrow(
        "External ID  1 ~ 255 자 사이여야 합니다."
      );
    });

    it("socialCode가 SocialCodeVO 인스턴스가 아니면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.socialCode = "kakao" as any;
      expect(() => AuthSocial.create(p)).toThrow(
        "socialCode는 SocialCodeVO 인스턴스여야 합니다."
      );
    });

    it.skip("userId가 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.userId = undefined as any;
      expect(() => AuthSocial.create(p)).toThrow(
        "UUID 값이 존재하지 않습니다."
      );
    });
  });
});
