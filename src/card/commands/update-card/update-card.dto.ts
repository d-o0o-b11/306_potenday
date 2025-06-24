import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  /**
   * 카드 제목
   * @example "카드 제목"
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * 카드 내용
   * @example "카드 내용"
   */
  @IsString()
  @IsOptional()
  context?: string;

  /**
   * 카드 위치 (top)
   * @example 100
   */
  @IsNumber()
  @IsOptional()
  top?: number;

  /**
   * 카드 위치 (left)
   * @example 200
   */
  @IsNumber()
  @IsOptional()
  left?: number;

  /**
   * 카드 열림 여부
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  foldedState?: boolean;
}

export class UpdateCardResponseDto {
  /**
   * 카드 ID
   * @example "uuid"
   */
  cardId: string;

  /**
   * 카드 제목
   * @example "카드 제목"
   */
  title: string;

  /**
   * 카드 내용
   * @example "카드 내용"
   */
  context: string;

  /**
   * 카드 위치 (top)
   * @example 100
   */
  top: number;

  /**
   * 카드 위치 (left)
   * @example 200
   */
  left: number;

  /**
   * 완료 날짜
   * @example "2025-06-24T00:00:00.000Z"
   */
  finishDate: Date | null;

  /**
   * 카드 열림 여부
   * @example true
   */
  foldedState: boolean;
}
