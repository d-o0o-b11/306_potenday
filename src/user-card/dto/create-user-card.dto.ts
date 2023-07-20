import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

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

  //Type 강제 형변환
  //현재 프론트에서 string으로 넘겨줘서 강제 형변환 중
  //number로 수정해서 보내주시면 Type 데코레이터 삭제하기!!!!!
  @ApiPropertyOptional({
    description: "기본 생성 폴더 id",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  default_folder_id?: number | undefined;

  @ApiPropertyOptional({
    description: "유저가 생성한 폴더 id",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  user_folder_id?: number | undefined;
}
