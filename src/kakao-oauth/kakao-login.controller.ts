import {
  Controller,
  Get,
  UseGuards,
  Redirect,
  Query,
  Req,
  Res,
  InternalServerErrorException,
  Post,
  Param,
} from "@nestjs/common";
import { KakaoLoginService } from "./kakao-login.service";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CtxUser } from "./decorator/auth.decorator";

@ApiTags("로그인 API")
@Controller("kakao-login")
export class KakaoLoginController {
  constructor(private readonly kakaoLoginService: KakaoLoginService) {}

  @ApiOperation({
    summary: "카카오 로그인 시도는 /kakao-login/login 에만 요청하시면 됩니다.",
  })
  @Get("login")
  @Redirect(
    `https://kauth.kakao.com/oauth/authorize?client_id=2a454928d20431c58b2e9e199c9cf847&redirect_uri=http://localhost:3000/kakao-login/kakao-callback&response_type=code`
  )
  async rediretLogin() {
    return "왔다";
  }

  @ApiOperation({
    summary: "신경 안쓰셔도 되는 api",
  })
  @Get("kakao-callback")
  @UseGuards(JwtAuthGuard)
  async handleKakaoCallback(
    @Query("code") code: string,
    @CtxUser() kakao_user
  ) {
    return await this.kakaoLoginService.kakaoLogin(kakao_user);
  }

  @ApiOperation({
    summary: "카카오 로그아웃",
  })
  @Post("logout:user_id")
  async kakaoUserLogout(@Param("user_id") user_id: number) {
    try {
      return await this.kakaoLoginService.logout(user_id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
