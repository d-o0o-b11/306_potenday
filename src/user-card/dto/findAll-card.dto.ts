import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllUserCardDto {
  @IsNumber()
  @ApiPropertyOptional({
    name: "default_folder_id",
    description: "기본 생성 폴더 id",
    example: 1,
  })
  @IsOptional()
  default_folder_id?: number;

  @IsNumber()
  @ApiPropertyOptional({
    name: "user_folder_id",
    description: "유저가 생성한 폴더 id",
    example: 1,
  })
  @IsOptional()
  user_folder_id?: number;
}
