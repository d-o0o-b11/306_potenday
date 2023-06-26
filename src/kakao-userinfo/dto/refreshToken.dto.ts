import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "refresh_token",
    example: "dfdsfrsff.fsdfjisdjif",
  })
  refresh_token: string;
}
