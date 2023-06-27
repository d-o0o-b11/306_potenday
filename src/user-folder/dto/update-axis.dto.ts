import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateAxisDto {
  @IsNumber()
  @ApiProperty({
    description: "폴더id",
    example: 1,
  })
  folder_id: number;

  @IsString()
  @ApiPropertyOptional({
    description: "가로축",
    example: "시급도",
  })
  width?: string | undefined;

  @IsString()
  @ApiPropertyOptional({
    description: "세로축",
    example: "중요도",
  })
  height?: string | undefined;
}
