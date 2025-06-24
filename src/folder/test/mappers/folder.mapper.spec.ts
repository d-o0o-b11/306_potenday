import { FolderMapper } from "../../mappers";
import { Folder } from "../../domains";
import { Folder as FolderEntity } from "src/database";
import { UUID } from "src/common";

const createValidFolderDomain = (): Folder => {
  return Folder.create({
    name: "개인 프로젝트",
    widthName: "시급도",
    heightName: "중요도",
    userId: UUID.create().unpack(),
  });
};

describe("FolderMapper", () => {
  describe("toPersistence", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = createValidFolderDomain();
      const props = domain.getProps();

      const entity = FolderMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(FolderEntity);
      expect(entity.id).toBe(domain.id.unpack());
      expect(entity.name).toBe(props.name);
      expect(entity.widthName).toBe(props.widthName);
      expect(entity.heightName).toBe(props.heightName);
      expect(entity.userId).toBe(props.userId.unpack());
    });
  });

  describe("toDomain", () => {
    it("엔티티를 도메인 객체로 변환한다", () => {
      const domain = createValidFolderDomain();
      const props = domain.getProps();

      const entity = new FolderEntity();
      entity.id = domain.id.unpack();
      entity.name = props.name;
      entity.widthName = props.widthName;
      entity.heightName = props.heightName;
      entity.userId = props.userId.unpack();

      const result = FolderMapper.toDomain(entity);
      const resultProps = result.getProps();

      expect(result).toBeInstanceOf(Folder);
      expect(result.id.equals(domain.id)).toBe(true);
      expect(resultProps.name).toBe(entity.name);
      expect(resultProps.widthName).toBe(entity.widthName);
      expect(resultProps.heightName).toBe(entity.heightName);
      expect(resultProps.userId.unpack()).toBe(entity.userId);
    });
  });
});
