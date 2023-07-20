import { DeleteResult, QueryRunner, UpdateResult } from "typeorm";
import { CreateKakaoUserinfoDto } from "../dto/create-kakao-userinfo.dto";
import { findUserReturnDto } from "../dto/find-user.dto";
import { KakaoUserInfoEntity } from "../entities/kakao-userinfo.entity";

export const USER_KAKAO_LOGIN_TOKEN = Symbol("UserKaKaoLoginInterface");

export interface UserKaKaoLoginInterface {
  /**
   * 카카오 로그인 후 데이터 저장
   * @param {CreateKakaoUserinfoDto} dto - 카카오 유저 정보 저장
   * @returns {KakaoUserInfoEntity} - 저장된 카카오 유저 정보 엔터티
   */
  saveUserInfo(
    dto: CreateKakaoUserinfoDto,
    queryRunner?: QueryRunner
  ): Promise<KakaoUserInfoEntity>;

  /**
   * 카카오에서 제공해주는 kakao_id를 이용해서 유저 정보 확인
   * @param kakao_id - string 카카오에서 제공해주는 id
   * @returns {KakaoUserInfoEntity}
   */
  findUserInfo(
    kakao_id: string,
    queryRunner?: QueryRunner
  ): Promise<KakaoUserInfoEntity>;

  /**
   * 데이터베이스에 저장된 유저 정보 가져오기
   * @param id - user_id
   * @returns {KakaoUserInfoEntity}
   */
  findUserInfoDBIdAll(id: number): Promise<KakaoUserInfoEntity>;

  /**
   *  프론트에 내보낼 때 필요한 유저 정보만 내보내기
   * @param id - user_id
   * @returns {findUserReturnDto}
   */
  findUserInfoDBId(id: number): Promise<findUserReturnDto>;

  /**
   * 로그아웃 기능
   * -> accesstoken Null로 바꾸기
   * -> refreshtoken Null로 바꾸기
   * @param user_id
   */
  logoutTokenNull(user_id: number): Promise<UpdateResult>;

  /**
   * accesstoken 1시간짜리 발급
   * @param id
   * @returns {string}
   */
  generateAccessToken(id: number): Promise<string>;

  /**
   * refreshtoken 한달짜리 발급
   * @param id
   * @returns {string}
   */
  generateRefreshToken(id: number): Promise<string>;

  /**
   * refreshtoken 재발급
   * @param refreshToken
   * @param userId
   */
  setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void>;

  /**
   * 카카오 로그인을 하면 -> 카카오에서 accesstoken 제공해주는 -> 이걸 db에 저장
   * @param accessToken 카카오에서 제공해주는 accesstoken
   * @param userId
   */
  setKaKaoCurrentAccessToken(
    accessToken: string,
    userId: number
  ): Promise<void>;

  /**
   * refreshtoken을 이용해서 accesstoken 재발급
   * refershtoken도 만료가 됐으면 에러 처리 -> 로그인부터 다시
   * @param refreshTokenDto
   */
  refreshTokenCheck(refreshTokenDto: string): Promise<{
    accessToken: string;
  }>;

  /**
   * 회원탈퇴
   * @param user_id
   */
  deleteUser(user_id: number): Promise<DeleteResult>;

  /**
   * 닉네임 변경
   * -> 24시간 제한
   * @param user_id
   * @param nickName
   */
  updateUserNickName(user_id: number, nickName: string): Promise<UpdateResult>;

  /**
   * 이메일 변경
   * -> 24시간 제한
   * @param user_id
   * @param user_email
   */
  updateUserEmail(user_id: number, user_email: string): Promise<UpdateResult>;

  /**
   * 이메일 알람 on/off 기능
   * @param user_id
   */
  userEmailActiveUpdate(user_id: number): Promise<UpdateResult>;

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
