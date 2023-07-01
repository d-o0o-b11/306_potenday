import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  InternalServerErrorException,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { KakaoUserinfoService } from "./kakao-userinfo.service";
import { CreateKakaoUserinfoDto } from "./dto/create-kakao-userinfo.dto";
import { UpdateKakaoUserinfoDto } from "./dto/update-kakao-userinfo.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAccessAuthGuard } from "src/kakao-oauth/jwt-access.guard";
import { CtxUser } from "src/kakao-oauth/decorator/auth.decorator";
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { JWTToken } from "./dto/jwt-token.dto";
import { NotFoundError } from "src/custom_error/not-found.error";
import { UpdateEmailDto } from "./dto/update-email.dto";

@ApiTags("유저 정보 API")
@Controller("kakao-userinfo")
export class KakaoUserinfoController {
  constructor(private readonly kakaoUserinfoService: KakaoUserinfoService) {}

  @ApiOperation({
    summary: "유저 정보 데이터베이스에 저장 << 개발확인용 API >>",
  })
  @Post()
  @ApiBody({
    type: CreateKakaoUserinfoDto,
  })
  async saveKakaoUser(dto: CreateKakaoUserinfoDto) {
    try {
      return await this.kakaoUserinfoService.saveUserInfo(dto);
    } catch (e) {
      throw new InternalServerErrorException("유저 정보 저장 로직 오류");
    }
  }

  @Get()
  @ApiOperation({
    summary: "유저 정보 출력",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  async userInfo(@CtxUser() token: JWTToken) {
    console.log("유저정보 얻어노는 과정 토큰 id확인", token.id);
    return await this.kakaoUserinfoService.findUserInfoDBId(token.id);
  }

  @ApiOperation({
    summary: "id 이용해서 신규/기존 유저 구분  << 개발확인용 API >>",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get("authenticate")
  async findKakaoUser(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoUserinfoService.findUserInfoDBId(token.id);
    } catch (e) {
      throw new InternalServerErrorException("유저 검색 로직 오류");
    }
  }

  @ApiOperation({
    summary:
      "access 토큰이 만료되면 refresh 토큰을 이용해서 access 토큰 재발급",
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @Post("refresh")
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;
    try {
      const newAccessToken = (
        await this.kakaoUserinfoService.refreshTokenCheck(refresh_token)
      ).accessToken;

      return { access_token: newAccessToken };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundException(e.message);

      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "회원 탈퇴",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: "회원 탈퇴 실패" })
  @Delete()
  async deleteUser(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoUserinfoService.deleteUser(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "유저 닉네임 변경",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: "회원 닉네임 수정 실패" })
  @Patch("nickname")
  async updateUserNickName(
    @CtxUser() token: JWTToken,
    @Body() dto: UpdateKakaoUserinfoDto
  ) {
    try {
      return await this.kakaoUserinfoService.updateUserNickName(
        token.id,
        dto.user_name
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "유저 이메일 변경",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: "회원 이메일 수정 실패" })
  @Patch("email")
  async updateUserEmail(
    @CtxUser() token: JWTToken,
    @Body() dto: UpdateEmailDto
  ) {
    try {
      return await this.kakaoUserinfoService.updateUserEmail(
        token.id,
        dto.user_email
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  @ApiOperation({
    summary: "회원가입 전날한사람 확인",
  })
  @Get("testtest")
  async findUserDay() {
    return await this.kakaoUserinfoService.findUserSignUpDate();
  }

  @ApiOperation({
    summary: "이메일 on/off 기능",
  })
  @Patch("email_alarm")
  async userEmailActive() {
    try {
      return await this.kakaoUserinfoService.userEmailActiveUpdate(3);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
