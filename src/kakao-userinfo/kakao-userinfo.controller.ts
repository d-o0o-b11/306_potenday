import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { KakaoUserinfoService } from "./kakao-userinfo.service";
import { CreateKakaoUserinfoDto } from "./dto/create-kakao-userinfo.dto";
import { UpdateKakaoUserinfoDto } from "./dto/update-kakao-userinfo.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAccessAuthGuard } from "src/kakao-oauth/jwt-access.guard";
import { CtxUser } from "src/kakao-oauth/decorator/auth.decorator";
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { CustomForbiddenException } from "src/custom_error/customForbiddenException.error";

@ApiTags("유저 정보 API")
@Controller("kakao-userinfo")
export class KakaoUserinfoController {
  constructor(private readonly kakaoUserinfoService: KakaoUserinfoService) {}

  @ApiOperation({
    summary: "유저 정보 데이터베이스에 저장",
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

  @ApiOperation({
    summary: "id 이용해서 신규/기존 유저 구분",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get("authenticate")
  async findKakaoUser(@Req() request: Request) {
    try {
      const userId = request["user"];
      return await this.kakaoUserinfoService.findUserInfoDBId(userId);
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

    const newAccessToken = (
      await this.kakaoUserinfoService.refreshTokenCheck(refresh_token)
    ).accessToken;

    return { access_token: newAccessToken };
  }

  @ApiOperation({
    summary: "회원 탈퇴",
  })
  @Delete()
  async deleteUser() {
    const user_id = 3;
    return await this.kakaoUserinfoService.deleteUser(user_id);
  }
}
