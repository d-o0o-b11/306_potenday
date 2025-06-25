import { UUID } from "src/common";
import copy from "fast-copy";
import { Folder } from "../../domains";

describe("Folder", () => {
  const validProps = {
    name: "306 프로젝트",
    widthName: "시급도",
    heightName: "중요도",
    userId: UUID.create().unpack(),
  };

  describe("create", () => {
    it("정상적으로 인스턴스를 생성해야 한다", () => {
      const folder = Folder.create(validProps);

      expect(folder).toBeInstanceOf(Folder);
      expect(folder.getProps().name).toBe(validProps.name);
      expect(folder.getProps().widthName).toBe(validProps.widthName);
      expect(folder.getProps().heightName).toBe(validProps.heightName);
      expect(folder.getProps().userId.unpack()).toBe(validProps.userId);
    });
  });

  describe("validate", () => {
    it("name이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.name = "";
      expect(() => Folder.create(p)).toThrow(
        "Folder 이름은 1~20자 사이여야 합니다."
      );
    });

    it("name이 21자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.name = "a".repeat(21);
      expect(() => Folder.create(p)).toThrow(
        "Folder 이름은 1~20자 사이여야 합니다."
      );
    });

    it("widthName이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.widthName = "";
      expect(() => Folder.create(p)).toThrow(
        "가로 축 이름은 1~10자 사이여야 합니다."
      );
    });

    it("widthName이 11자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.widthName = "a".repeat(11);
      expect(() => Folder.create(p)).toThrow(
        "가로 축 이름은 1~10자 사이여야 합니다."
      );
    });

    it("heightName이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.heightName = "";
      expect(() => Folder.create(p)).toThrow(
        "세로 축 이름은 1~10자 사이여야 합니다."
      );
    });

    it("heightName이 11자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.heightName = "a".repeat(11);
      expect(() => Folder.create(p)).toThrow(
        "세로 축 이름은 1~10자 사이여야 합니다."
      );
    });

    it.skip("userId가 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.userId = null as unknown as string;
      expect(() => Folder.create(p)).toThrow("User ID 존재하지 않습니다.");
    });
  });

  describe("updateInfo", () => {
    it("name만 업데이트한다", () => {
      const folder = Folder.create(validProps);
      folder.updateInfo({ name: "개인 메모" });

      expect(folder.getProps().name).toBe("개인 메모");
      expect(folder.getProps().widthName).toBe(validProps.widthName);
      expect(folder.getProps().heightName).toBe(validProps.heightName);
    });

    it("widthName만 업데이트한다", () => {
      const folder = Folder.create(validProps);
      folder.updateInfo({ widthName: "긴급도" });

      expect(folder.getProps().widthName).toBe("긴급도");
    });

    it("heightName만 업데이트한다", () => {
      const folder = Folder.create(validProps);
      folder.updateInfo({ heightName: "난이도" });

      expect(folder.getProps().heightName).toBe("난이도");
    });

    it("모든 필드를 동시에 업데이트한다", () => {
      const folder = Folder.create(validProps);
      folder.updateInfo({
        name: "업데이트 폴더",
        widthName: "긴급도",
        heightName: "난이도",
      });

      expect(folder.getProps().name).toBe("업데이트 폴더");
      expect(folder.getProps().widthName).toBe("긴급도");
      expect(folder.getProps().heightName).toBe("난이도");
    });

    it("유효하지 않은 값으로 업데이트 시 예외가 발생한다", () => {
      const folder = Folder.create(validProps);
      expect(() => folder.updateInfo({ name: "" })).toThrow(
        "Folder 이름은 1~20자 사이여야 합니다."
      );
    });
  });

  describe("equals", () => {
    it("같은 ID면 true를 반환한다", () => {
      const id = UUID.create();
      const folder1 = new Folder({
        id,
        props: { ...validProps, userId: UUID.create(validProps.userId) },
      });
      const folder2 = new Folder({
        id,
        props: { ...validProps, userId: UUID.create(validProps.userId) },
      });

      expect(folder1.equals(folder2)).toBe(true);
    });

    it("다른 ID면 false를 반환한다", () => {
      const folder1 = Folder.create(validProps);
      const folder2 = Folder.create(validProps);

      expect(folder1.equals(folder2)).toBe(false);
    });
  });
});
