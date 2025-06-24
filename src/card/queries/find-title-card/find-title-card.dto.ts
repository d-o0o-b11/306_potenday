import { IsString } from "class-validator";

export class FindTitleCardDto {
  /**
   *  카드 제목
   * @example "카드 제목"
   */
  @IsString()
  title: string;
}

export class FindTitleCardResponseDto {
  /**
   * 폴더명
   * @example '폴더 명'
   */
  folderName: string;

  /**
   * 카드 제목
   * @example '306 프로젝트'
   */
  title: string;

  /**
   * 카드 생성 날짜
   * @example '2025-06-24T12:00:00Z'
   */
  createdAt: Date;

  /**
   * 카드 완료 날짜
   * @example null
   */
  finishDate: Date | null;
}
