import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateUserCardDto {
  @ApiProperty({
    description: "위치 top",
    example: 3,
  })
  @IsNumber()
  top: number;

  @ApiProperty({
    description: "위치 left",
    example: 3,
  })
  @IsNumber()
  left: number;

  @ApiProperty({
    description: "위시 카드 제목",
    example: "",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "위시 카드 내용",
    example: "",
  })
  @IsString()
  context: string;

  @ApiPropertyOptional({
    description: "기본 생성 폴더 id",
    example: 1,
  })
  @IsNumber()
  default_folder_id?: number | undefined;

  @ApiPropertyOptional({
    description: "유저가 생성한 폴더 id",
    example: 1,
  })
  @IsNumber()
  user_folder_id?: number | undefined;
}
