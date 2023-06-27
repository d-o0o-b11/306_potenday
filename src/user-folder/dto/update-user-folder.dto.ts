import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateUserFolderDto {
  @IsNumber()
  @ApiProperty({
    description: "folder_id",
    example: 1,
  })
  folder_id: number;

  @IsString()
  @ApiProperty({
    description: "폴더명",
    example: "수정한 폴더명",
  })
  folder_name: string;
}
