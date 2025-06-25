import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateInfoDto {
  /**
   * 유저 이름
   * @example 'd_o0o_b'
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * 유저 프로필 이미지
   * @example 'https://example.com/profile.jpg'
   */
  @IsString()
  @IsOptional()
  email?: string;

  /**
   * 이메일 전송 여부
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  emailActive?: boolean;
}

export class UpdateInfoResponseDto {
  /**
   * 유저 ID
   * @example 'uuid'
   */
  userId: string;

  /**
   * 유저 이름
   * @example 'd_o0o_b'
   */
  name: string;

  /**
   * 유저 이메일
   * @example 'https://example.com/profile.jpg'
   */
  email: string;

  /**
   * 이메일 전송 여부
   * @example true
   */
  emailActive: boolean;

  /**
   * 유저 프로필 이미지
   * @example 'https://example.com/profile.jpg'
   */
  profile: string;
}
