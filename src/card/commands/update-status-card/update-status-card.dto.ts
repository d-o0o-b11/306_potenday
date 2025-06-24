import { IsBoolean } from "class-validator";

export class UpdateStatusCardDto {
  /**
   * 카드 완려 여부
   * @example true
   */
  @IsBoolean()
  status: boolean;
}
