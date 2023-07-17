import { Test, TestingModule } from "@nestjs/testing";
import { KakaoLoginService } from "./kakao-login.service";
import {
  USER_KAKAO_LOGIN_TOKEN,
  UserKaKaoLoginInterface,
} from "src/kakao-userinfo/interface/kakao-login.interface";

describe("KakaoLoginService", () => {
  let service: KakaoLoginService;
  let kakaoUserInfoService: UserKaKaoLoginInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KakaoLoginService,
        {
          provide: USER_KAKAO_LOGIN_TOKEN,
          useValue: {
            findUserInfo: jest.fn(),
            saveUserInfo: jest.fn(),
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            setCurrentRefreshToken: jest.fn(),
            setKaKaoCurrentAccessToken: jest.fn(),
            logoutTokenNull: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KakaoLoginService>(KakaoLoginService);
    kakaoUserInfoService = module.get<UserKaKaoLoginInterface>(
      USER_KAKAO_LOGIN_TOKEN
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(kakaoUserInfoService).toBeDefined();
  });

  describe("kakoLogin", () => {
    const kakao_user = {
      accessToken: "ACCESS-TOKEN",
      kakao_id: "1111",
      nickname: "지민",
      email: "dddd@naver.com",
      profile_image: "ddd/png",
    };

    const findUserIdDB = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "ddd/png",
      user_email: "dddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      created_at: new Date("2022-02-01"),
      email_active: true,
    } as any;

    const data = {
      kakao_id: "1111",
      user_name: "지민",
      user_img: "ddd/png",
      user_email: "dddd@naver.com",
      accesstoken: undefined,
      refreshtoken: undefined,
    } as any;

    it("최초 로그인 로직 ==> 회원가입", async () => {
      const findResult = jest
        .spyOn(kakaoUserInfoService, "findUserInfo")
        .mockResolvedValue(null);

      const saveResult = jest
        .spyOn(kakaoUserInfoService, "saveUserInfo")
        .mockResolvedValue(findUserIdDB);

      const access_token = jest
        .spyOn(kakaoUserInfoService, "generateAccessToken")
        .mockResolvedValue("ACCESS-TOKEN");

      const refresh_token = jest
        .spyOn(kakaoUserInfoService, "generateRefreshToken")
        .mockResolvedValue("REFRESH-TOKEN");

      const setCurrentRefreshToken = jest.spyOn(
        kakaoUserInfoService,
        "setCurrentRefreshToken"
      );

      const setKaKaoCurrentAccessToken = jest.spyOn(
        kakaoUserInfoService,
        "setKaKaoCurrentAccessToken"
      );

      await service.kakaoLogin(kakao_user);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(kakao_user.kakao_id);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(data);

      expect(access_token).toBeCalledTimes(1);
      expect(access_token).toBeCalledWith(findUserIdDB.id);

      expect(refresh_token).toBeCalledTimes(1);
      expect(refresh_token).toBeCalledWith(findUserIdDB.id);

      expect(setCurrentRefreshToken).toBeCalledTimes(1);
      expect(setCurrentRefreshToken).toBeCalledWith(
        findUserIdDB.refreshtoken,
        findUserIdDB.id
      );

      expect(setKaKaoCurrentAccessToken).toBeCalledTimes(1);
      expect(setKaKaoCurrentAccessToken).toBeCalledWith(
        findUserIdDB.accesstoken,
        findUserIdDB.id
      );
    });

    it("이미 회원인 사람이 로그인한 경우", async () => {
      const findResult = jest
        .spyOn(kakaoUserInfoService, "findUserInfo")
        .mockResolvedValue(findUserIdDB);

      const access_token = jest
        .spyOn(kakaoUserInfoService, "generateAccessToken")
        .mockResolvedValue("ACCESS-TOKEN");

      const refresh_token = jest
        .spyOn(kakaoUserInfoService, "generateRefreshToken")
        .mockResolvedValue("REFRESH-TOKEN");

      const setCurrentRefreshToken = jest.spyOn(
        kakaoUserInfoService,
        "setCurrentRefreshToken"
      );

      const setKaKaoCurrentAccessToken = jest.spyOn(
        kakaoUserInfoService,
        "setKaKaoCurrentAccessToken"
      );

      await service.kakaoLogin(kakao_user);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(kakao_user.kakao_id);

      expect(access_token).toBeCalledTimes(1);
      expect(access_token).toBeCalledWith(findUserIdDB.id);

      expect(refresh_token).toBeCalledTimes(1);
      expect(refresh_token).toBeCalledWith(findUserIdDB.id);

      expect(setCurrentRefreshToken).toBeCalledTimes(1);
      expect(setCurrentRefreshToken).toBeCalledWith(
        findUserIdDB.refreshtoken,
        findUserIdDB.id
      );

      expect(setKaKaoCurrentAccessToken).toBeCalledTimes(1);
      expect(setKaKaoCurrentAccessToken).toBeCalledWith(
        findUserIdDB.accesstoken,
        findUserIdDB.id
      );
    });
  });

  describe("logout", () => {
    const user_id = 1;

    it("로그아웃 기능", async () => {
      const logoutTokenNull = jest.spyOn(
        kakaoUserInfoService,
        "logoutTokenNull"
      );

      await service.logout(user_id);

      expect(logoutTokenNull).toBeCalledTimes(1);
      expect(logoutTokenNull).toBeCalledWith(user_id);
    });
  });
});
