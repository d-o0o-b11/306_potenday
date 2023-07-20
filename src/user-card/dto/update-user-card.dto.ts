import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserCardDto {
  @IsNumber()
  @ApiProperty({
    description: "위시 id",
    example: 1,
  })
  card_id: number;

  @IsNumber()
  @ApiPropertyOptional({
    description: "위치 top",
    example: 3,
  })
  @IsOptional()
  top?: number;

  @IsNumber()
  @ApiPropertyOptional({
    description: "위치 left",
    example: 3,
  })
  @IsOptional()
  left?: number;

  @IsString()
  @ApiPropertyOptional({
    description: "위시 제목",
    example: "제목이다",
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: "위시 내용",
    example: "내용이다",
  })
  @IsString()
  @IsOptional()
  context?: string;
}
