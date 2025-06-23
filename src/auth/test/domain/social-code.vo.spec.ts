import { SocialCodeVO } from "../../domain";

describe("SocialCodeVO", () => {
  describe("create", () => {
    it("KAKAO는 value가 1인 인스턴스여야 한다", () => {
      const kakao = SocialCodeVO.KAKAO;

      expect(kakao).toBeInstanceOf(SocialCodeVO);
      expect(kakao.value).toBe(1);
    });
  });

  describe("validate", () => {
    it("허용된 코드(1)로 생성하면 정상적으로 생성된다", () => {
      const vo = SocialCodeVO.create(1);
      expect(vo.value).toBe(1);
    });

    it("허용되지 않은 코드로 생성하면 예외를 발생한다", () => {
      expect(() => SocialCodeVO.create(99)).toThrow(
        "유효하지 않은 소셜 코드입니다."
      );
      expect(() => SocialCodeVO.create(0)).toThrow(
        "유효하지 않은 소셜 코드입니다."
      );
      expect(() => SocialCodeVO.create(-1)).toThrow(
        "유효하지 않은 소셜 코드입니다."
      );
    });
  });

  describe("equals", () => {
    it("값이 같으면 true를 반환한다", () => {
      const a = SocialCodeVO.create(1);
      const b = SocialCodeVO.create(1);

      expect(a.equals(b)).toBe(true);
    });

    it("값이 다르면 false를 반환한다", () => {
      const a = SocialCodeVO.create(1);
      const b = { value: 2, equals: () => false } as any;

      expect(a.equals(b)).toBe(false);
    });
  });
});
