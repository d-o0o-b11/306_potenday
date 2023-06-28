import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateKakaoUserinfoDto } from "./dto/create-kakao-userinfo.dto";
import { UpdateKakaoUserinfoDto } from "./dto/update-kakao-userinfo.dto";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { KakaoUserInfoEntity } from "./entities/kakao-userinfo.entity";
import { plainToInstance } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { CustomForbiddenException } from "src/custom_error/customForbiddenException.error";
import { NotFoundError } from "src/custom_error/not-found.error";
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
  async saveUserInfo(dto: CreateKakaoUserinfoDto) {
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
  async findUserInfo(kakao_id: string) {
    const findOneResult = await this.kakaoUserRepository.findOne({
      where: {
        kakao_id: kakao_id,
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
    return findOneResult;
  }

  async logoutTokenNull(user_id: number) {
    const removeResult = await this.kakaoUserRepository.update(user_id, {
      accesstoken: "",
      refreshtoken: "",
    });

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
      expiresIn: 3600,
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
      expiresIn: 1800000,
    });
  }
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    // const currentRefreshToken = await this.getCurrentHashedRefreshToken(
    //   refreshToken
    // );
    // const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.kakaoUserRepository.update(userId, {
      refreshtoken: refreshToken,
    });
  }

  async setKaKaoCurrentAccessToken(accessToken: string, userId: number) {
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

  async refreshTokenCheck(refreshTokenDto: string) {
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

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findUserInfoDBId(userId);

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
    const deleteResult = await this.kakaoUserRepository.delete(user_id);

    if (!deleteResult.affected) {
      throw new Error("회원 탈퇴 실패");
    }

    return deleteResult;
  }

  async updateUserNickName(
    user_id: number,
    nickName: string
  ): Promise<UpdateResult> {
    const updateResult = await this.kakaoUserRepository.update(user_id, {
      user_name: nickName,
    });

    if (!updateResult.affected) {
      throw new Error("회원 닉네임 수정 실패");
    }

    return updateResult;
  }
}
