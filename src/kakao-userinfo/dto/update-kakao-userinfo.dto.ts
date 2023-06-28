import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateKakaoUserinfoDto } from "./create-kakao-userinfo.dto";
import { IsString } from "class-validator";

export class UpdateKakaoUserinfoDto {
  @ApiProperty({
    description: "변경할 닉네임",
    example: "지민이다",
  })
  @IsString()
  user_name: string;
}
