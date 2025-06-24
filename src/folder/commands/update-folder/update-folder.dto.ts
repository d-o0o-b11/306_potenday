import { IsString } from "class-validator";

export class UpdateFolderDto {
  /**
   * 폴더 이름
   * @example '개인 프로젝트'
   */
  @IsString()
  name: string;

  /**
   * 폴더의 가로 축 이름
   * @example '시급도'
   */
  @IsString()
  widthName?: string;

  /**
   * 폴더의 세로 축 이름
   * @example '중요도'
   */
  @IsString()
  heightName?: string;
}

export class UpdateFolderResponseDto {
  /**
   * 폴더 ID
   * @example uuid
   */
  folderId: string;

  /**
   * 폴더 이름
   * @example '개인 프로젝트'
   */
  name: string;

  /**
   * 폴더의 가로 축 이름
   * @example '시급도'
   */
  widthName: string;

  /**
   * 폴더의 세로 축 이름
   * @example '중요도'
   */
  heightName: string;
}
