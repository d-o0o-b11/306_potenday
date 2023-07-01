import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateKakaoUserinfoDto } from "./dto/create-kakao-userinfo.dto";
import { Between, DeleteResult, Not, Repository, UpdateResult } from "typeorm";
import { KakaoUserInfoEntity } from "./entities/kakao-userinfo.entity";
import { plainToInstance } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { NotFoundError } from "src/custom_error/not-found.error";
import axios from "axios";
// import bcrypt from "bcrypt";

@Injectable()
export class KakaoUserinfoService {
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
    return findOneResult;
  }

  async findUserInfoDBIdAll(id: number): Promise<KakaoUserInfoEntity> {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        id: id,
      },
    });
    return findOneResult;
  }

  async findUserInfoDBId(id: number) {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        id: id,
      },
    });
    const day = this.getDaysDiffFromNow(findOneResult.created_at);

    const result = {
      id: findOneResult.id,
      user_name: findOneResult.user_name,
      user_img: findOneResult.user_img,
      user_email: findOneResult.user_email,
      day: day,
    };
    return result;
  }

  getDaysDiffFromNow(targetDate: Date): number {
    const currentDate = new Date();
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

    if (removeResult.affected) {
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
    // const currentRefreshToken = await this.getCurrentHashedRefreshToken(
    //   refreshToken
    // );
    // const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.kakaoUserRepository.update(userId, {
      refreshtoken: refreshToken,
    });
  }

  async setKaKaoCurrentAccessToken(
    accessToken: string,
    userId: number
  ): Promise<void> {
    // const currentRefreshToken = await this.getCurrentHashedRefreshToken(
    //   refreshToken
    // );
    // const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.kakaoUserRepository.update(userId, {
      accesstoken: accessToken,
    });
  }

  // async getCurrentHashedRefreshToken(refreshToken: string) {
  //   // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
  //   // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.
  //   const saltOrRounds = 10;
  //   const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
  //   return currentRefreshToken;
  // }

  // async getCurrentRefreshTokenExp(): Promise<Date> {
  //   const currentDate = new Date();
  //   // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
  //   const currentRefreshTokenExp = new Date(currentDate.getTime() + 1800000);
  //   return currentRefreshTokenExp;
  // }

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
      refreshTokenDto,
      userId
    );

    if (!user) {
      throw new NotFoundError("refreshToken 일치하지 않습니다.");
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number
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

    if (!findResult) {
      new Error("존재하지 않는 유저입니다.");
    }

    if (findResult.nickname_update_time != null) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(
        findResult?.nickname_update_time.getTime() + 24 * 60 * 60 * 1000
      );

      if (findResult.nickname_update_time && now < twentyFourHoursAgo) {
        throw new Error("새 닉네임은 24시간 동안 수정할 수 없습니다.");
      }
    }

    const updateResult = await this.kakaoUserRepository.update(user_id, {
      user_name: nickName,
      nickname_update_time: new Date(),
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
      new Error("존재하지 않는 유저입니다.");
    }

    if (findResult.email_update_time != null) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(
        findResult?.email_update_time.getTime() + 24 * 60 * 60 * 1000
      );

      if (findResult.email_update_time && now < twentyFourHoursAgo) {
        throw new Error("새 이메일은 24시간 동안 수정할 수 없습니다.");
      }
    }

    const updateResult = await this.kakaoUserRepository.update(user_id, {
      user_email: user_email,
      email_update_time: new Date(),
    });

    if (!updateResult.affected) {
      throw new Error("회원 닉네임 수정 실패");
    }

    return updateResult;
  }
  /**
   * 회원가입한 날 기준으로 조회 후 하루 전에 회원가입 한 사람들 목록 출력
   */
  async findUserSignUpDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date();
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
        created_at: Between(
          new Date(dateStr_yesterday),
          new Date(dateStr_tomorrow)
        ),
      },
    });
    return findResult;
  }

  //on/off 기능 24시간 전에
  async userEmailActiveUpdate(user_id: number): Promise<UpdateResult> {
    const findResult = await this.kakaoUserRepository.findOne({
      where: {
        id: user_id,
      },
    });

    if (!findResult) {
      new Error("존재하지 않는 유저입니다.");
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

    if (updateResult.affected) {
      new Error("on/off 기능 오류 발생");
    }

    return updateResult;
  }

  //알림 받는 유저만 출력(월요일 10시에 메일 받을 사람들) , 어제 오늘 회원가입한 사람은 제외!!
  async usreEmailActiveTrue(): Promise<KakaoUserInfoEntity[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date();
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
