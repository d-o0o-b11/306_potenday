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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CtxUser } from "./decorator/auth.decorator";
import { JwtAccessAuthGuard } from "./jwt-access.guard";
import { JWTToken } from "src/kakao-userinfo/dto/jwt-token.dto";
import { Response } from "express";

@ApiTags("로그인 API")
@Controller("kakao-login")
export class KakaoLoginController {
  constructor(private readonly kakaoLoginService: KakaoLoginService) {}

  @ApiOperation({
    summary: "카카오 로그인 시도는 /kakao-login/login 에만 요청하시면 됩니다.",
    description:
      "카카오 로그인은 url에 직접 복사해서 사용하셔야해요!!! -> 그 외의 방법은 오류 발생",
  })
  @Get("login")
  async redirectToKakaoLogin(@Res() res: Response) {
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`;
    res.redirect(302, redirectUrl);
  }

  @ApiOperation({
    summary: "<< 개발확인용 API >>",
  })
  @Get("kakao-callback")
  @UseGuards(JwtAuthGuard)
  async handleKakaoCallback(
    @Query("code") code: string,
    @CtxUser() kakao_user,
    @Res() res: Response
  ) {
    const { access_token, refresh_token } =
      await this.kakaoLoginService.kakaoLogin(kakao_user);

    const redirectUrl = `http://13.209.73.234:3000?access_token=${access_token}&refresh_token=${refresh_token}`;
    console.log("redi", redirectUrl);
    res.redirect(302, redirectUrl);
  }

  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: "카카오 로그아웃",
  })
  @Post("logout")
  async kakaoUserLogout(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoLoginService.logout(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
