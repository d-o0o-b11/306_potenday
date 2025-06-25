export class FindFolderCardListResponseDto {
  /**
   * 카드 ID
   * @example "uuid"
   */
  cardId: string;

  /**
   * 카드 제목
   * @example "306 프로젝트"
   */
  title: string;

  /**
   * 카드 내용
   * @example "306 프로젝트 리팩토링"
   */
  context: string;

  /**
   * 카드의 세로 축 위치
   * @example 100
   */
  top: number;

  /**
   * 카드의 가로 축 위치
   * @example 100
   */
  left: number;

  /**
   * 카드 완료 날짜
   * @example "2025-06-24T00:00:00.000Z"
   */
  finishDate: Date | null;

  /**
   * 카드 접힌 상태
   * @example false
   */
  foldedState: boolean;
}
