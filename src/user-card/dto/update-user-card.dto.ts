import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateUserCardDto {
  @IsNumber()
  @ApiProperty({
    description: "위시 id",
    example: 1,
  })
  card_id: number;

  @IsString()
  @ApiPropertyOptional({
    description: "위시 제목",
    example: "제목이다",
  })
  title?: string;

  @ApiPropertyOptional({
    description: "위시 내용",
    example: "내용이다",
  })
  @IsString()
  context?: string;
}
