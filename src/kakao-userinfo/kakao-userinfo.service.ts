import { Injectable } from "@nestjs/common";
import { CreateKakaoUserinfoDto } from "./dto/create-kakao-userinfo.dto";
import { Between, DeleteResult, Not, Repository, UpdateResult } from "typeorm";
import { KakaoUserInfoEntity } from "./entities/kakao-userinfo.entity";
import { plainToInstance } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { NotFoundError } from "src/custom_error/not-found.error";
import axios from "axios";
import { findUserReturnDto } from "./dto/find-user.dto";
import { UserKaKaoLoginInterface } from "./interface/kakao-login.interface";

@Injectable()
export class KakaoUserinfoService implements UserKaKaoLoginInterface {
  constructor(
    @InjectRepository(KakaoUserInfoEntity)
    private readonly kakaoUserRepository: Repository<KakaoUserInfoEntity>,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 카카오 로그인 후 데이터 저장
   * @param dto 카카오 유저 정보 저장
   * @returns
   */
  async saveUserInfo(
    dto: CreateKakaoUserinfoDto
  ): Promise<KakaoUserInfoEntity> {
    const createUserDtoToEntity = plainToInstance(KakaoUserInfoEntity, dto);
    const saveResult = await this.kakaoUserRepository.save(
      createUserDtoToEntity
    );

    return saveResult;
  }

  /**
   * 카카오를 통해서 로그인하는 유저들을 식별할 수 있는 유일한 고유 값 kakao_id를 이용해서 데이터베이스에서 확인하기
   * 없으면 -> save
   * 있으면 -> access , refresh token 재발급
   * @param id 카카오에서 제공해주는 id
   */
  async findUserInfo(kakao_id: string): Promise<KakaoUserInfoEntity> {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        kakao_id: kakao_id,
      },
    });

    //유저가 존재하지 않으면 404 notfounderror

    return findOneResult;
  }

  async findUserInfoDBIdAll(id: number): Promise<KakaoUserInfoEntity> {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        id: id,
      },
    });

    //유저가 존재하지 않으면 404 notfounderror
    return findOneResult;
  }

  async findUserInfoDBId(id: number): Promise<findUserReturnDto> {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        id: id,
      },
    });
    //유저가 존재하지 않으면 404 notfounderror

    //회원가입 후 서비스 이용 날짜 출력 ex @일차
    const day = this.getDaysDiffFromNow(findOneResult.created_at);

    const result = {
      id: findOneResult.id,
      user_name: findOneResult.user_name,
      user_img: findOneResult.user_img,
      user_email: findOneResult.user_email,
      day: day,
      email_active: findOneResult.email_active,
    };
    return result;
  }

  //이 서비스 내부에서만 사용하기에 interface 안적음
  getDaysDiffFromNow(targetDate: Date): number {
    const currentDate = new Date(Date.now());
    const diffInMilliseconds = Math.abs(
      currentDate.getTime() - targetDate.getTime()
    );
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

  async logoutTokenNull(user_id: number): Promise<UpdateResult> {
    const removeResult = await this.kakaoUserRepository.update(user_id, {
      accesstoken: "",
      refreshtoken: "",
    });
    //1이 나오면 성공한거
    if (!removeResult.affected) {
      throw new Error("로그아웃 실패");
    }

    return removeResult;
  }

  /**
   * 유저 id 를 이용해서 토큰 생성
   * 1시간으로 설정
   * @param id 데이터베이스 id
   * @returns
   */
  async generateAccessToken(id: number): Promise<string> {
    const payload = {
      id: id,
    };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: 60480,
    });
  }

  /**
   * 유저 id 를 이용해서 refresh 토큰 생성
   * @param id 데이터베이스 id
   * @returns
   */
  async generateRefreshToken(id: number): Promise<string> {
    const payload = {
      id: id,
    };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: 2592000,
    });
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number
  ): Promise<void> {
    await this.kakaoUserRepository.update(userId, {
      refreshtoken: refreshToken,
    });
  }

  async setKaKaoCurrentAccessToken(
    accessToken: string,
    userId: number
  ): Promise<void> {
    await this.kakaoUserRepository.update(userId, {
      accesstoken: accessToken,
    });
  }

  async refreshTokenCheck(refreshTokenDto: string): Promise<{
    accessToken: string;
  }> {
    const decodedRefreshToken = await this.jwtService.verifyAsync(
      refreshTokenDto,
      { secret: process.env.JWT_REFRESH_SECRET }
    );

    // Check if user exists
    const userId = decodedRefreshToken.id;
    const user = await this.getUserIfRefreshTokenMatches(
      userId,
      refreshTokenDto
    );

    //유저가 존재하지 않으면 404 notfounderror
    if (!user) {
      throw new NotFoundError("refreshToken 일치하지 않습니다.");
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(user.id);
    console.log("accres", user);

    return { accessToken };
  }

  //refreshTokenCheck 여기 서비스에서만 사용
  async getUserIfRefreshTokenMatches(
    userId: number,
    refreshToken?: string
  ): Promise<KakaoUserInfoEntity> {
    const user = await this.findUserInfoDBIdAll(userId);

    // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
    if (!user.refreshtoken) {
      return null;
    }

    if (refreshToken === user.refreshtoken) {
      return user;
    } else {
      return null;
    }
  }

  //일단 얜 테스트 코드 제외
  async deleteUser(user_id: number): Promise<DeleteResult> {
    const findUser = await this.findUserInfoDBIdAll(user_id);

    const accessToken = findUser.accesstoken;

    const url = "https://kapi.kakao.com/v1/user/unlink";

    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const deleteResult = await this.kakaoUserRepository.delete(user_id);

      if (!deleteResult.affected) {
        throw new Error("회원 탈퇴 실패");
      }
      return deleteResult;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateUserNickName(
    user_id: number,
    nickName: string
  ): Promise<UpdateResult> {
    const findResult = await this.kakaoUserRepository.findOne({
      where: {
        id: user_id,
      },
    });

    //유저가 존재하지 않으면 404 notfounderror
    if (!findResult) {
      throw new Error("존재하지 않는 유저입니다.");
    }

    if (findResult.nickname_update_time != null) {
      const now = new Date(Date.now());
      const twentyFourHoursAgo = new Date(
        findResult?.nickname_update_time.getTime() + 24 * 60 * 60 * 1000
      );

      //BadRequestException 에러 이거 커스터메러 작성도 필요
      if (findResult.nickname_update_time && now < twentyFourHoursAgo) {
        throw new Error("새 닉네임은 24시간 동안 수정할 수 없습니다.");
      }
    }

    const updateResult = await this.kakaoUserRepository.update(user_id, {
      user_name: nickName,
      nickname_update_time: new Date(Date.now()),
    });

    if (!updateResult.affected) {
      throw new Error("회원 닉네임 수정 실패");
    }

    return updateResult;
  }

  async updateUserEmail(
    user_id: number,
    user_email: string
  ): Promise<UpdateResult> {
    const findResult = await this.kakaoUserRepository.findOne({
      where: {
        id: user_id,
      },
    });

    if (!findResult) {
      throw new Error("존재하지 않는 유저입니다.");
    }

    if (findResult.email_update_time != null) {
      const now = new Date(Date.now());
      const twentyFourHoursAgo = new Date(
        findResult?.email_update_time.getTime() + 24 * 60 * 60 * 1000
      );
      //BadRequestException 에러 이거 커스터메러 작성도 필요
      if (findResult.email_update_time && now < twentyFourHoursAgo) {
        throw new Error("새 이메일은 24시간 동안 수정할 수 없습니다.");
      }
    }

    const updateResult = await this.kakaoUserRepository.update(user_id, {
      user_email: user_email,
      email_update_time: new Date(Date.now()),
    });

    if (!updateResult.affected) {
      throw new Error("회원 닉네임 수정 실패");
    }

    return updateResult;
  }

  //on/off 기능
  async userEmailActiveUpdate(user_id: number): Promise<UpdateResult> {
    const findResult = await this.kakaoUserRepository.findOne({
      where: {
        id: user_id,
      },
    });

    //notfound error
    if (!findResult) {
      throw new Error("존재하지 않는 유저입니다.");
    }

    let active: boolean;

    //true 면
    if (findResult.email_active) {
      active = false;
    } else {
      active = true;
    }

    const updateResult = await this.kakaoUserRepository.update(user_id, {
      email_active: active,
    });

    if (!updateResult.affected) {
      throw new Error("on/off 기능 오류 발생");
    }

    return updateResult;
  }

  //여기는 나중에 제일 마지막에 수정!!
  /**
   * 회원가입한 날 기준으로 조회 후 하루 전에 회원가입 한 사람들 목록 출력
   */
  async findUserSignUpDate(): Promise<KakaoUserInfoEntity[]> {
    const today = new Date(Date.now()); //todayㄹ호 바꿔야함 어제 날짜만 확인하는거여서 오늘날짜도 제외해야함
    // tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");

    const year_today = today.getFullYear();
    const month_today = String(today.getMonth() + 1).padStart(2, "0");
    const day_today = String(today.getDate()).padStart(2, "0");

    const dateStr_yesterday = `${year}-${month}-${day}`;

    const dateStr_today = `${year_today}-${month_today}-${day_today}`;
    console.log("dateStr_yesterday", new Date(dateStr_yesterday));
    const findResult = await this.kakaoUserRepository.find({
      where: {
        created_at: Between(
          new Date(dateStr_yesterday),
          new Date(dateStr_today)
        ),
      },
    });
    return findResult;
  }

  //알림 받는 유저만 출력(월요일 10시에 메일 받을 사람들) , 어제 오늘 회원가입한 사람은 제외!!
  async usreEmailActiveTrue(): Promise<KakaoUserInfoEntity[]> {
    const tomorrow = new Date(Date.now());
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");

    const year_tomorrow = tomorrow.getFullYear();
    const month_tomorrow = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day_tomorrow = String(tomorrow.getDate()).padStart(2, "0");

    const dateStr_yesterday = `${year}-${month}-${day}`;

    const dateStr_tomorrow = `${year_tomorrow}-${month_tomorrow}-${day_tomorrow}`;

    const findResult = await this.kakaoUserRepository.find({
      where: {
        created_at: Not(
          Between(new Date(dateStr_yesterday), new Date(dateStr_tomorrow))
        ),
        email_active: true,
      },
    });

    return findResult;
  }
}
