import { CardMapper } from "../../mappers";
import { Card } from "../../domains";
import { Card as CardEntity } from "src/database";
import { UUID } from "src/common";

const createValidCardDomain = (): Card => {
  return Card.create({
    title: "제목",
    context: "내용",
    top: 100,
    left: 200,
    folderId: UUID.create().unpack(),
    userId: UUID.create().unpack(),
    finishDate: new Date("2025-06-24"),
    foldedState: true,
  });
};

describe("CardMapper", () => {
  describe("toPersistence", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = createValidCardDomain();
      const props = domain.getProps();

      const entity = CardMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(CardEntity);
      expect(entity.id).toBe(domain.id.unpack());
      expect(entity.title).toBe(props.title);
      expect(entity.context).toBe(props.context);
      expect(entity.top).toBe(props.top);
      expect(entity.left).toBe(props.left);
      expect(entity.folderId).toBe(props.folderId.unpack());
      expect(entity.userId).toBe(props.userId.unpack());
      expect(entity.finishDate).toEqual(props.finishDate);
      expect(entity.foldedState).toBe(props.foldedState);
    });
  });

  describe("toDomain", () => {
    it("엔티티를 도메인 객체로 변환한다", () => {
      const domain = createValidCardDomain();
      const props = domain.getProps();

      const entity = new CardEntity();
      entity.id = domain.id.unpack();
      entity.title = props.title;
      entity.context = props.context;
      entity.top = props.top;
      entity.left = props.left;
      entity.folderId = props.folderId.unpack();
      entity.userId = props.userId.unpack();
      entity.finishDate = props.finishDate;
      entity.foldedState = props.foldedState;

      const result = CardMapper.toDomain(entity);
      const resultProps = result.getProps();

      expect(result).toBeInstanceOf(Card);
      expect(result.id.equals(domain.id)).toBe(true);
      expect(resultProps.title).toBe(entity.title);
      expect(resultProps.context).toBe(entity.context);
      expect(resultProps.top).toBe(entity.top);
      expect(resultProps.left).toBe(entity.left);
      expect(resultProps.folderId.unpack()).toBe(entity.folderId);
      expect(resultProps.userId.unpack()).toBe(entity.userId);
      expect(resultProps.finishDate).toEqual(entity.finishDate);
      expect(resultProps.foldedState).toBe(entity.foldedState);
    });
  });
});
