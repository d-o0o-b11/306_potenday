import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateKakaoUserinfoDto {
  @IsString()
  @ApiProperty({
    description: "카카오 고유 id",
  })
  kakao_id: string;

  @IsString()
  @ApiProperty({
    description: "유저 닉네임",
  })
  user_name: string;

  @IsString()
  @ApiProperty({
    description: "유저 프로필",
  })
  user_img: string;

  @IsString()
  @ApiPropertyOptional({
    description: "유저 이메일",
  })
  @IsOptional()
  user_email?: string | undefined;

  @IsString()
  @ApiProperty({
    description: "토큰",
  })
  accesstoken: string;

  @IsString()
  @ApiPropertyOptional({
    description: "refresh 토큰",
  })
  @IsOptional()
  refreshtoken?: string | undefined;

  constructor(data: Partial<CreateKakaoUserinfoDto>) {
    Object.assign(this, data);
  }
}
