import { UUID } from "src/common";
import copy from "fast-copy";
import { Card } from "../../domains";

describe("Card", () => {
  const validProps = {
    title: "카드 제목",
    context: "카드 내용",
    top: 100,
    left: 200,
    folderId: UUID.create().unpack(),
    userId: UUID.create().unpack(),
  };

  describe("create", () => {
    it("정상적으로 인스턴스를 생성해야 한다", () => {
      const card = Card.create(validProps);

      expect(card).toBeInstanceOf(Card);
      expect(card.getProps().title).toBe(validProps.title);
      expect(card.getProps().context).toBe(validProps.context);
      expect(card.getProps().top).toBe(validProps.top);
      expect(card.getProps().left).toBe(validProps.left);
      expect(card.getProps().folderId.unpack()).toBe(validProps.folderId);
      expect(card.getProps().userId.unpack()).toBe(validProps.userId);
      expect(card.getProps().finishDate).toBe(null);
      expect(card.getProps().foldedState).toBe(false);
    });
  });

  describe("validate", () => {
    it("title이 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.title = "";
      expect(() => Card.create(p)).toThrow(
        "카드 제목은 1~20자 사이여야 합니다."
      );
    });

    it("context가 101자 이상이면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.context = "a".repeat(101);
      expect(() => Card.create(p)).toThrow(
        "카드 내용은 1~100자 사이여야 합니다."
      );
    });

    it("top이 숫자가 아니면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.top = "invalid" as unknown as number;
      expect(() => Card.create(p)).toThrow("top, left는 숫자여야 합니다.");
    });

    it.skip("folderId가 없으면 예외가 발생한다", () => {
      const p = copy(validProps);
      p.folderId = null as unknown as string;
      expect(() => Card.create(p)).toThrow("Folder ID가 존재하지 않습니다.");
    });
  });

  describe("updateInfo", () => {
    it("title만 업데이트한다", () => {
      const card = Card.create(validProps);
      card.updateInfo({ title: "새 제목" });
      expect(card.getProps().title).toBe("새 제목");
    });

    it("모든 필드를 업데이트한다", () => {
      const card = Card.create(validProps);
      card.updateInfo({
        title: "제목 변경",
        context: "내용 변경",
        top: 999,
        left: 888,
        foldedState: true,
      });

      const props = card.getProps();
      expect(props.title).toBe("제목 변경");
      expect(props.context).toBe("내용 변경");
      expect(props.top).toBe(999);
      expect(props.left).toBe(888);
      expect(props.foldedState).toBe(true);
    });

    it("유효하지 않은 값으로 업데이트 시 예외가 발생한다", () => {
      const card = Card.create(validProps);
      expect(() => card.updateInfo({ title: "" })).toThrow(
        "카드 제목은 1~20자 사이여야 합니다."
      );
    });
  });

  describe("updateFinishDate", () => {
    it("finishDate를 null에서 현재 날짜로 업데이트한다", () => {
      const card = Card.create(validProps);
      const now = new Date();
      card.updateFinishDate(true);
      expect(card.getProps().finishDate).toEqual(now);
    });

    it("finishDate를 다시 null로 설정한다", () => {
      const card = Card.create({ ...validProps, finishDate: new Date() });
      card.updateFinishDate(false);
      expect(card.getProps().finishDate).toBe(null);
    });
  });

  describe("equals", () => {
    it("같은 ID면 true를 반환한다", () => {
      const id = UUID.create();
      const card1 = new Card({
        id,
        props: {
          ...validProps,
          folderId: UUID.create(validProps.folderId),
          userId: UUID.create(validProps.userId),
          finishDate: null,
          foldedState: false,
        },
      });
      const card2 = new Card({
        id,
        props: {
          ...validProps,
          folderId: UUID.create(validProps.folderId),
          userId: UUID.create(validProps.userId),
          finishDate: null,
          foldedState: false,
        },
      });
      expect(card1.equals(card2)).toBe(true);
    });

    it("다른 ID면 false를 반환한다", () => {
      const card1 = Card.create(validProps);
      const card2 = Card.create(validProps);
      expect(card1.equals(card2)).toBe(false);
    });
  });
});
