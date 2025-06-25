import { UUID } from "src/common";
import { User } from "../../domain";
import copy from "fast-copy";

describe("User", () => {
  const validProps = {
    name: "d_o0o_b",
    email: "test@example.com",
    profile: "https://example.com/image.png",
  };

  describe("create", () => {
    it("정상적으로 인스턴스를 생성해야 한다", () => {
      const user = User.create(validProps);
      expect(user).toBeInstanceOf(User);
      expect(user.getProps().name).toBe(validProps.name);
      expect(user.getProps().email).toBe(validProps.email);
      expect(user.getProps().profile).toBe(validProps.profile);
    });
  });

  describe("validate", () => {
    it("emailActive가 기본값 true로 설정된다", () => {
      const user = User.create(validProps);
      expect(user.getProps().emailActive).toBe(true);
    });

    it("emailActive를 false로 명시할 수 있다", () => {
      const user = User.create({ ...validProps, emailActive: false });
      expect(user.getProps().emailActive).toBe(false);
    });

    it("name이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.name = "";
      expect(() => User.create(p)).toThrow("Name 1 ~ 10 자 사이여야 합니다.");
    });

    it("name이 11자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.name = "a".repeat(11);
      expect(() => User.create(p)).toThrow("Name 1 ~ 10 자 사이여야 합니다.");
    });

    it("이메일 길이가 256자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.email = "a".repeat(250) + "@x.com";
      expect(() => User.create(p)).toThrow(
        "Email은 1 ~ 255 자 사이의 유효한 이메일 형식이어야 합니다."
      );
    });

    it("이메일 형식이 아니면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.email = "invalid-email";
      expect(() => User.create(p)).toThrow(
        "Email은 1 ~ 255 자 사이의 유효한 이메일 형식이어야 합니다."
      );
    });

    it("profile이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.profile = "";
      expect(() => User.create(p)).toThrow("Profile 존재하지 않습니다.");
    });
  });

  describe("updateInfo", () => {
    it("name만 업데이트한다", () => {
      const user = User.create(validProps);
      user.updateInfo({ name: "new-name" });

      expect(user.getProps().name).toBe("new-name");
      expect(user.getProps().email).toBe(validProps.email);
      expect(user.getProps().emailActive).toBe(true);
    });

    it("email만 업데이트한다", () => {
      const user = User.create(validProps);
      user.updateInfo({ email: "updated@example.com" });

      expect(user.getProps().email).toBe("updated@example.com");
      expect(user.getProps().name).toBe(validProps.name);
      expect(user.getProps().emailActive).toBe(true);
    });

    it("emailActive만 업데이트한다", () => {
      const user = User.create(validProps);
      user.updateInfo({ emailActive: false });

      expect(user.getProps().emailActive).toBe(false);
      expect(user.getProps().name).toBe(validProps.name);
      expect(user.getProps().email).toBe(validProps.email);
    });

    it("모든 필드를 동시에 업데이트한다", () => {
      const user = User.create(validProps);
      user.updateInfo({
        name: "updated",
        email: "new@email.com",
        emailActive: false,
      });

      expect(user.getProps().name).toBe("updated");
      expect(user.getProps().email).toBe("new@email.com");
      expect(user.getProps().emailActive).toBe(false);
    });

    it("유효하지 않은 값으로 업데이트 시 예외가 발생한다", () => {
      const user = User.create(validProps);
      expect(() => user.updateInfo({ name: "" })).toThrow(
        "Name 1 ~ 10 자 사이여야 합니다."
      );
    });
  });

  describe("equals", () => {
    it("같은 ID면 true를 반환해야 한다", () => {
      const id = UUID.create();
      const u1 = new User({ id, props: validProps });
      const u2 = new User({ id, props: validProps });

      expect(u1.equals(u2)).toBeTruthy();
    });

    it("다른 ID면 false를 반환해야 한다", () => {
      const u1 = new User({ id: UUID.create(), props: validProps });
      const u2 = new User({ id: UUID.create(), props: validProps });

      expect(u1.equals(u2)).toBeFalsy();
    });
  });
});
