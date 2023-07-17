import { Test, TestingModule } from "@nestjs/testing";
import { KakaoUserinfoService } from "./kakao-userinfo.service";
import { Between, Not, Repository } from "typeorm";
import { KakaoUserInfoEntity } from "./entities/kakao-userinfo.entity";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockRepository } from "src/mock.repository";
import * as MockClassTransformer from "class-transformer";
import { CustomNotFoundError } from "src/custom_error/custom-notfound.error";

describe("KakaoUserinfoService", () => {
  let service: KakaoUserinfoService;
  let kakaoUserRepository: Repository<KakaoUserInfoEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KakaoUserinfoService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(KakaoUserInfoEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    jest.resetModules();
    service = module.get<KakaoUserinfoService>(KakaoUserinfoService);
    kakaoUserRepository = module.get<Repository<KakaoUserInfoEntity>>(
      getRepositoryToken(KakaoUserInfoEntity)
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(kakaoUserRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe("saveUserInfo", () => {
    const CreateKakaoUserinfoDto = {
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    const createUserDtoToEntityData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    it("카카오 로그인 후 데이터 저장 << 회원가입 >>", async () => {
      const createUserDtoToEntity = jest
        .spyOn(MockClassTransformer, "plainToInstance")
        .mockReturnValue(createUserDtoToEntityData);

      const saveResult = jest
        .spyOn(kakaoUserRepository, "save")
        .mockResolvedValue(createUserDtoToEntityData);

      await service.saveUserInfo(CreateKakaoUserinfoDto);

      expect(createUserDtoToEntity).toBeCalledTimes(1);
      expect(createUserDtoToEntity).toBeCalledWith(
        KakaoUserInfoEntity,
        CreateKakaoUserinfoDto
      );

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(createUserDtoToEntityData);
    });
  });

  describe("findUserInfo", () => {
    const findOneData = {
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    const kakao_id = "1111";

    it("유저 정보 조회 <<KAKAO-id>>", async () => {
      const findOneResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findOneData);

      await service.findUserInfo(kakao_id);

      expect(findOneResult).toBeCalledTimes(1);
      expect(findOneResult).toBeCalledWith({
        where: {
          kakao_id: kakao_id,
        },
      });
    });
  });

  describe("findUserInfoDBIdAll << Backend측에서 사용할 서비스 >>", () => {
    const findOneData = {
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    const id = 1;

    it("유저 정보 조회 <<DB_id>>", async () => {
      const findOneResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findOneData);

      await service.findUserInfoDBIdAll(id);

      expect(findOneResult).toBeCalledTimes(1);
      expect(findOneResult).toBeCalledWith({
        where: {
          id: id,
        },
      });
    });
  });

  describe("findUserInfoDBId <<Frontend측에 내보낼 서비스 >>", () => {
    const findOneData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      email_active: true,
      created_at: new Date("2023-07-04"),
    } as any;

    const id = 1;

    it("유저 정보 조회에서 필요한 값들만 내보내기", async () => {
      const findOneResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findOneData);

      const day = service.getDaysDiffFromNow(findOneData.created_at);

      const server = await service.findUserInfoDBId(id);

      expect(findOneResult).toBeCalledTimes(1);
      expect(findOneResult).toBeCalledWith({
        where: {
          id: id,
        },
      });

      expect(day).toStrictEqual(2);

      expect(server).toStrictEqual({
        id: findOneData.id,
        user_name: findOneData.user_name,
        user_img: findOneData.user_img,
        user_email: findOneData.user_email,
        day: 2,
        email_active: findOneData.email_active,
      });
    });

    it("유저 정보 조회에서 필요한 값들만 내보내기 error", async () => {
      const findOneResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(null);

      await expect(
        async () => await service.findUserInfoDBId(id)
      ).rejects.toThrow(new CustomNotFoundError("존재하지 않는 유저입니다."));

      expect(findOneResult).toBeCalledTimes(1);
      expect(findOneResult).toBeCalledWith({
        where: {
          id: id,
        },
      });
    });
  });

  describe("getDaysDiffFromNow", () => {
    // beforeEach(() =>
    //   jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime())
    // );

    it("사용자가 회원가입한 날짜부터 오늘까지 며칠됐는지 계산", () => {
      const targetDate = new Date("2023-07-01");
      const server = service.getDaysDiffFromNow(targetDate);

      expect(server).toStrictEqual(5);
    });
  });

  describe("logoutTokenNull", () => {
    const updateResultDataTrue = {
      raw: [],
      affected: 1,
      generatedMaps: [],
    };

    const updateResultDataFalse = {
      raw: [],
      affected: 0,
      generatedMaps: [],
    };

    const user_id = 1;

    it("로그아웃시 토큰 삭제", async () => {
      const removeResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue(updateResultDataTrue);

      await service.logoutTokenNull(user_id);

      expect(removeResult).toBeCalledTimes(1);
      expect(removeResult).toBeCalledWith(user_id, {
        accesstoken: "",
        refreshtoken: "",
      });
    });

    it("로그아웃시 실패 시 오류", async () => {
      const removeResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue(updateResultDataFalse);

      await expect(async () =>
        service.logoutTokenNull(user_id)
      ).rejects.toThrow(new Error("로그아웃에 실패하였습니다."));

      expect(removeResult).toBeCalledTimes(1);
      expect(removeResult).toBeCalledWith(user_id, {
        accesstoken: "",
        refreshtoken: "",
      });
    });
  });

  describe("generateAccessToken", () => {
    const id = 1;
    const expectedToken = "ACCESS-TOKEN";

    it("ACCESS-TOKEN 발급", async () => {
      const jwt = jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValue(expectedToken);

      // generateAccessToken 메서드를 호출하고 반환된 토큰을 저장
      const accessToken = await service.generateAccessToken(id);

      // JwtService의 signAsync 메서드가 올바르게 호출되었는지 검증
      expect(jwt).toHaveBeenCalledWith(
        { id },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: 60480,
        }
      );

      // 반환된 토큰과 예상되는 토큰이 일치하는지 검증
      expect(accessToken).toStrictEqual(expectedToken);
    });
  });

  describe("generateRefreshToken", () => {
    const id = 1;
    const expectedToken = "REFRESH-TOKEN";

    it("ACCESS-TOKEN 발급", async () => {
      const jwt = jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValue(expectedToken);

      const accessToken = await service.generateRefreshToken(id);

      expect(jwt).toHaveBeenCalledWith(
        { id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: 2592000,
        }
      );

      expect(accessToken).toStrictEqual(expectedToken);
    });
  });

  describe("setCurrentRefreshToken", () => {
    const refreshToken = "REFRESH-TOKEN";
    const user_id = 1;

    it("refresh token 재발급", async () => {
      const updateResult = jest.spyOn(kakaoUserRepository, "update");
      await service.setCurrentRefreshToken(refreshToken, user_id);

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(user_id, {
        refreshtoken: refreshToken,
      });
    });
  });

  describe("setKaKaoCurrentAccessToken", () => {
    const accessToken = "ACCESS-TOKEN";
    const user_id = 1;

    it("access token 재발급", async () => {
      const updateResult = jest.spyOn(kakaoUserRepository, "update");
      await service.setKaKaoCurrentAccessToken(accessToken, user_id);

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(user_id, {
        accesstoken: accessToken,
      });
    });
  });

  describe("refreshTokenCheck", () => {
    const refreshTokenMatchData = {
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    const userData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    const user_id = 1;

    it("refresh token을 이용해서 access token 재발급", async () => {
      const decodedRefreshToken = jest
        .spyOn(jwtService, "verifyAsync")
        .mockResolvedValue({ id: user_id });

      const user = jest
        .spyOn(service, "getUserIfRefreshTokenMatches")
        .mockResolvedValue(userData);

      const accessToken = jest
        .spyOn(service, "generateAccessToken")
        .mockResolvedValue("ACCESS-TOKEN");

      const server = await service.refreshTokenCheck(refreshTokenMatchData);

      expect(decodedRefreshToken).toBeCalledWith(refreshTokenMatchData, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      expect(user).toBeCalledWith(user_id, refreshTokenMatchData);

      expect(accessToken).toBeCalledTimes(1);
      expect(accessToken).toBeCalledWith(userData.id);

      expect(server).toStrictEqual({ accessToken: "ACCESS-TOKEN" });
    });

    it("refresh token도 만료 된 경우", async () => {
      const decodedRefreshToken = jest
        .spyOn(jwtService, "verifyAsync")
        .mockResolvedValue({ id: user_id });

      const user = jest
        .spyOn(service, "getUserIfRefreshTokenMatches")
        .mockResolvedValue(null);

      await expect(
        async () => await service.refreshTokenCheck(refreshTokenMatchData)
      ).rejects.toThrow(
        new CustomNotFoundError("refreshToken 일치하지 않습니다.")
      );

      expect(decodedRefreshToken).toBeCalledWith(refreshTokenMatchData, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      expect(user).toBeCalledWith(user_id, refreshTokenMatchData);
    });
  });

  describe("getUserIfRefreshTokenMatches", () => {
    const refreshToken = "REFRESH-TOKEN";
    const norefreshToken = "NONE-REFRESH-TOKEN";
    const user_id = 1;

    const findOneData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
    } as any;

    it("유저 refresh token가 없는 경우", async () => {
      const user = jest
        .spyOn(service, "findUserInfoDBIdAll")
        .mockResolvedValue(findOneData);

      const server = await service.getUserIfRefreshTokenMatches(user_id);

      expect(user).toBeCalledTimes(1);
      expect(user).toBeCalledTimes(user_id);

      expect(server).toBeNull();
    });

    it("유저 refresh token이 일치한다 == 유저 정보 출력", async () => {
      const user = jest
        .spyOn(service, "findUserInfoDBIdAll")
        .mockResolvedValue(findOneData);

      const server = await service.getUserIfRefreshTokenMatches(
        user_id,
        refreshToken
      );

      expect(user).toBeCalledTimes(1);
      expect(user).toBeCalledTimes(user_id);

      expect(server).toStrictEqual(findOneData);
    });

    it("유저 refresh token가 일치하지 않는 경우", async () => {
      const user = jest
        .spyOn(service, "findUserInfoDBIdAll")
        .mockResolvedValue(findOneData);

      const server = await service.getUserIfRefreshTokenMatches(
        user_id,
        norefreshToken
      );

      expect(user).toBeCalledTimes(1);
      expect(user).toBeCalledTimes(user_id);

      expect(server).toBeNull();
    });
  });

  //deleteUser 추가필요

  describe("updateUserNickName", () => {
    beforeEach(() =>
      jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime())
    );

    const findResultData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      nickname_update_time: new Date(Date.now()),
    } as any;

    const findResultData2 = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      nickname_update_time: new Date("2023-07-01"),
    } as any;

    const user_id = 1;
    const nickName = "지민이다";

    it("유저가 없는 경우 error", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(null);

      await expect(
        async () => await service.updateUserNickName(user_id, nickName)
      ).rejects.toThrow(new CustomNotFoundError("존재하지 않는 유저입니다."));

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });
    });

    it("유저가 닉네임 변경을 24시간 내에 한 경우 error", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData);

      await expect(
        async () => await service.updateUserNickName(user_id, nickName)
      ).rejects.toThrow(
        new Error("새 닉네임은 24시간 동안 수정할 수 없습니다.")
      );

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });
    });

    it("유저 닉네임 변경 성공", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData2);

      const updateResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.updateUserNickName(user_id, nickName);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toHaveBeenCalledWith(user_id, {
        user_name: nickName,
        nickname_update_time: new Date(Date.now()),
      });
    });
  });

  describe("updateUserEmail", () => {
    beforeEach(() =>
      jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime())
    );

    const findResultData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      email_update_time: new Date(Date.now()),
    } as any;

    const findResultData2 = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      email_update_time: new Date("2023-07-01"),
    } as any;

    const user_id = 1;
    const user_email = "ddd@naver.com";

    it("유저가 없는 경우 error", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(null);

      await expect(
        async () => await service.updateUserEmail(user_id, user_email)
      ).rejects.toThrow(new Error("존재하지 않는 유저입니다."));

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });
    });

    it("유저가 이메일 변경을 24시간 내에 한 경우 error", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData);

      await expect(
        async () => await service.updateUserEmail(user_id, user_email)
      ).rejects.toThrow(
        new Error("새 이메일은 24시간 동안 수정할 수 없습니다.")
      );

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });
    });

    it("유저 이메일 변경 성공", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData2);

      const updateResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.updateUserEmail(user_id, user_email);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toHaveBeenCalledWith(user_id, {
        user_email: user_email,
        email_update_time: new Date(Date.now()),
      });
    });
  });

  describe("userEmailActiveUpdate", () => {
    const user_id = 1;

    const findResultData = {
      id: 1,
      kakao_id: "1111",
      user_name: "지민",
      user_img: "dfdd/img",
      user_email: "ddd@naver.com",
      accesstoken: "ACCESS-TOKEN",
      refreshtoken: "REFRESH-TOKEN",
      email_update_time: new Date(Date.now()),
      email_active: true,
    } as any;

    it("존재하지 않는 유저", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(null);

      await expect(
        async () => await service.userEmailActiveUpdate(user_id)
      ).rejects.toThrow(new Error("존재하지 않는 유저입니다."));

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });
    });

    it("on/off 기능 오류", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData);

      const updateResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 0,
          generatedMaps: [],
        });

      await expect(
        async () => await service.userEmailActiveUpdate(user_id)
      ).rejects.toThrow(new Error("on/off 기능 오류 발생"));

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(user_id, {
        email_active: false,
      });
    });

    it("이메일 알림 기능 정상 작동", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "findOne")
        .mockResolvedValue(findResultData);

      const updateResult = jest
        .spyOn(kakaoUserRepository, "update")
        .mockResolvedValue({
          raw: [],
          affected: 1,
          generatedMaps: [],
        });

      await service.userEmailActiveUpdate(user_id);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          id: user_id,
        },
      });

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(user_id, {
        email_active: false,
      });
    });
  });

  describe("findUserSignUpDate", () => {
    let yesterday: Date;

    beforeEach(() => {
      jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime());

      yesterday = new Date(Date.now());
      yesterday.setDate(yesterday.getDate() - 1);
    });

    const user1 = {
      id: 1,
      created_at: yesterday,
      user_name: "User 1",
    } as any;

    const user2 = {
      id: 2,
      created_at: new Date(Date.now()), // Today's date
      user_name: "User 2",
    } as any;

    it("회원가입 전날에 한사람들 출력", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "find")
        .mockResolvedValue([user1, user2]);

      const server = await service.findUserSignUpDate();

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          created_at: Between(yesterday, new Date(Date.now())),
        },
      });

      expect(server).toStrictEqual([user1, user2]);
    });
  });

  describe("usreEmailActiveTrue", () => {
    let yesterday: Date;
    let tomorrow: Date;

    beforeEach(() => {
      jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime());

      yesterday = new Date(Date.now());
      yesterday.setDate(yesterday.getDate() - 1);

      tomorrow = new Date(Date.now());
      tomorrow.setDate(tomorrow.getDate() + 1);
    });

    const user1 = {
      id: 1,
      created_at: new Date("2023-07-04"), // Yesterday's date
      email_active: true,
      user_name: "User 1",
    } as any;

    const user2 = {
      id: 2,
      created_at: new Date("2023-07-05"), // Today's date
      email_active: true,
      user_name: "User 2",
    } as any;

    const user3 = {
      id: 3,
      created_at: new Date("2023-07-03"), // Two days ago
      email_active: true,
      user_name: "User 3",
    } as any;

    it("회원가입 어제 오늘 한사람들 제외하고 출력", async () => {
      const findResult = jest
        .spyOn(kakaoUserRepository, "find")
        .mockResolvedValue([user3]);

      const result = await service.usreEmailActiveTrue();

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        where: {
          created_at: Not(Between(yesterday, tomorrow)),
          email_active: true,
        },
      });

      expect(result).toStrictEqual([user3]);
    });
  });
});
