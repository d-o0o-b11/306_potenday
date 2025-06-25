import { IsNumber, IsString } from "class-validator";

export class CreateCardDto {
  /**
   * 카드 제목
   * @example '306 프로젝트'
   */
  @IsString()
  title: string;

  /**
   * 카드 내용
   * @example '306 프로젝트 리팩토링'
   */
  @IsString()
  context: string;

  /**
   * 세로 축 위치
   * @example 100
   */
  @IsNumber()
  top: number;

  /**
   * 가로 축 위치
   * @example 100
   */
  @IsNumber()
  left: number;

  /**
   * 폴더 ID
   * @example 'uuid'
   */
  @IsString()
  folderId: string;
}
