export class InfoResponseDto {
  /**
   * 유저 ID
   * @example "uuid"
   */
  userId: string;

  /**
   * 유저 이름
   * @example "d_o0o_b"
   */
  name: string;

  /**
   * 유저 이메일
   * @example "test@example.com"
   */
  email: string;

  /**
   * 유저 이메일 활성화 여부
   * @example true
   */
  emailActive: boolean;

  /**
   * 유저 프로필 이미지 URL
   * @example "https://example.com/profile.jpg"
   */
  profile: string;
}
