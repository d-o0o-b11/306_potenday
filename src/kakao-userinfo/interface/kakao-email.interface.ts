import { KakaoUserInfoEntity } from "../entities/kakao-userinfo.entity";

export interface UserKaKaoEmailInterface {
  /**
   * 회원가입한 날 기준으로 조회 후 하루 전에 회원가입 한 사람들 목록 출력
   */
  findUserSignUpDate(): Promise<KakaoUserInfoEntity[]>;

  /**
   * 알림 받는 유저만 출력(월요일 10시에 메일 받을 사람들)
   * 어제 오늘 회원가입한 사람은 제외
   */
  usreEmailActiveTrue(): Promise<KakaoUserInfoEntity[]>;
}
