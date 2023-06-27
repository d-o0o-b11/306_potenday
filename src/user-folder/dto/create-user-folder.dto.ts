import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserFolderDto {
  @IsString()
  @ApiProperty({
    description: "생성할 폴더명",
    example: "새폴더생성",
  })
  folder_name: string;
}
