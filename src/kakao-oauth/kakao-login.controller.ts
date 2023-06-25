import { Controller, Get, UseGuards, Redirect, Query } from "@nestjs/common";
import { KakaoLoginService } from "./kakao-login.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("로그인 API")
@Controller("kakao-login")
export class KakaoLoginController {
  constructor(private readonly kakaoLoginService: KakaoLoginService) {}

  @Get("login")
  @Redirect(
    `https://kauth.kakao.com/oauth/authorize?client_id=2a454928d20431c58b2e9e199c9cf847&redirect_uri=http://localhost:3000/kakao-login/kakao-callback&response_type=code`
  )
  async rediretLogin() {
    return "왔다";
  }

  @Get("kakao-callback")
  @UseGuards(JwtAuthGuard)
  async handleKakaoCallback(@Query("code") code: string) {
    // try {
    //   // 액세스 토큰 요청
    //   const response = await axios.post("https://kauth.kakao.com/oauth/token", {
    //     grant_type: "authorization_code",
    //     client_id: "2a454928d20431c58b2e9e199c9cf847",
    //     redirect_uri: "http://localhost:3000/kakao-login/kakao-callback",
    //     code: code,
    //   });
    //   const accessToken = response.data.access_token;
    //   console.log("accessToken", accessToken);
    //   // 사용자 정보 요청
    //   const userInfoResponse = await axios.get(
    //     "https://kapi.kakao.com/v2/user/me",
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );
    //   const userInfo = userInfoResponse.data;
    //   // 사용자 정보 처리 로직
    //   console.log("userInfo", userInfo);
    // } catch (error) {
    //   console.error("Failed to fetch user information", error);
    // }
    // console.log("code", code);
  }

  @Get("logout")
  async kakaoUserLogout() {
    return await this.kakaoLoginService.logout();
  }
}
