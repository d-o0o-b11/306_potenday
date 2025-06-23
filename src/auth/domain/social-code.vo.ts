import { ValueObject } from "src/common";

export class SocialCodeVO extends ValueObject<number> {
  static create(value: number): SocialCodeVO {
    return new SocialCodeVO(value);
  }

  protected validate(): void {
    if (![1].includes(this.value)) {
      throw new Error("유효하지 않은 소셜 코드입니다.");
    }
  }

  static KAKAO = new SocialCodeVO(1);
}
