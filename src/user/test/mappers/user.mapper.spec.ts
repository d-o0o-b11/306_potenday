import { UserMapper } from "../../mappers";
import { User } from "../../domain";
import { User as UserEntity } from "src/database";

const createValidUserDomain = (): User => {
  return User.create({
    name: "d_o0o_b",
    email: "test@example.com",
    profile: "https://example.com/image.png",
    emailActive: false,
  });
};

describe("UserMapper", () => {
  describe("toPersistence", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = createValidUserDomain();
      const props = domain.getProps();

      const entity = UserMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.id).toBe(domain.id.unpack());
      expect(entity.name).toBe(props.name);
      expect(entity.email).toBe(props.email);
      expect(entity.profile).toBe(props.profile);
      expect(entity.emailActive).toBe(props.emailActive);
    });

    it("emailActive가 undefined면 true로 설정된다", () => {
      const domain = User.create({
        name: "d_o0o_b",
        email: "test@example.com",
        profile: "https://example.com/image.png",
        // emailActive 생략
      });

      const entity = UserMapper.toPersistence(domain);

      expect(entity.emailActive).toBe(true);
    });
  });

  describe("toDomain", () => {
    it("엔티티를 도메인 객체로 변환한다", () => {
      const domain = createValidUserDomain();
      const props = domain.getProps();

      const entity = new UserEntity();
      entity.id = domain.id.unpack();
      entity.name = props.name;
      entity.email = props.email;
      entity.profile = props.profile;
      entity.emailActive = props.emailActive;

      const result = UserMapper.toDomain(entity);
      const resultProps = result.getProps();

      expect(result).toBeInstanceOf(User);
      expect(result.id.unpack()).toBe(entity.id);
      expect(resultProps.name).toBe(entity.name);
      expect(resultProps.email).toBe(entity.email);
      expect(resultProps.profile).toBe(entity.profile);
      expect(resultProps.emailActive).toBe(entity.emailActive);
    });
  });
});
