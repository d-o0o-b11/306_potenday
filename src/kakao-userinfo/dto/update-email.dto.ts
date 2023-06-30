import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateEmailDto {
  @IsString()
  @ApiProperty({
    description: "변경할 이메일",
    example: "dddd@naver.com",
  })
  user_email: string;
}
