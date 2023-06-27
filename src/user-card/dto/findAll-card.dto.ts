import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindAllUserCard {
  @IsNumber()
  @ApiPropertyOptional({
    name: "default_folder_id",
    description: "기본 생성 폴더 id",
    example: 1,
  })
  default_folder_id?: number;

  @IsNumber()
  @ApiPropertyOptional({
    name: "user_folder_id",
    description: "유저가 생성한 폴더 id",
    example: 1,
  })
  user_folder_id?: number;
}
