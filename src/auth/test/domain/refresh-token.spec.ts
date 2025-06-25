import { randomUUID } from "crypto";
import { RefreshToken } from "../../domain";
import { UUID } from "src/common";
import copy from "fast-copy";

describe("RefreshToken", () => {
  const validProps = {
    userId: randomUUID(),
    token: "valid-token",
    sessionId: randomUUID(),
    expiredAt: "1h",
  };

  describe("create", () => {
    it("정상적으로 RefreshToken을 생성한다", () => {
      const token = RefreshToken.create(validProps);

      expect(token).toBeInstanceOf(RefreshToken);
      expect(token.id).toBeInstanceOf(UUID);
      expect(token.getProps().userId.unpack()).toEqual(validProps.userId);
    });
  });

  describe("validate", () => {
    it.skip("userId가 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.userId = null as any;
      expect(() => RefreshToken.create(p)).toThrow(
        "UUID 값이 존재하지 않습니다."
      );
    });

    it("token이 빈 문자열이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.token = "";
      expect(() => RefreshToken.create(p)).toThrow(
        "Token 1 ~ 255 자 사이여야 합니다."
      );
    });

    it("token이 256자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.token = "a".repeat(256);
      expect(() => RefreshToken.create(p)).toThrow(
        "Token 1 ~ 255 자 사이여야 합니다."
      );
    });

    it("sessionId가 잘못된 UUID면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.sessionId = "not-uuid" as any;
      expect(() => RefreshToken.create(p)).toThrow("Invalid Domain UUID");
    });

    it("expiredAt이 과거면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.expiredAt = "-1m";
      expect(() => RefreshToken.create(p)).toThrow(
        "Expired At은 현재 시점 이후여야 합니다."
      );
    });

    it("expiredAt이 현재보다 이후 시간이라면 정상 생성된다", () => {
      const p = copy(validProps);
      p.expiredAt = "30m";

      const token = RefreshToken.create(p);

      expect(token).toBeInstanceOf(RefreshToken);
      expect(token.getProps().expiredAt.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
