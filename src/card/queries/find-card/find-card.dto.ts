export class FindCardResponseDto {
  /**
   * 카드 ID
   * @example uuid
   */
  cardId: string;

  /**
   * 카드 제목
   * @example '306 프로젝트'
   */
  title: string;

  /**
   * 카드 내용
   * @example '306 프로젝트 리팩토링'
   */
  context: string;

  /**
   * 카드 위치 (top)
   * @example 100
   */
  top: number;

  /**
   * 카드 위치 (left)
   * @example 100
   */
  left: number;

  /**
   * 카드 완료 날짜
   * @example null
   */
  finishDate: Date | null;

  /**
   * 카드 접힌 상태
   * @example false
   */
  foldedState: boolean;
}
