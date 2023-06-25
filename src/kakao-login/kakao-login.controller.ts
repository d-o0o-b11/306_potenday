import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Redirect,
  Query,
} from "@nestjs/common";
import { KakaoLoginService } from "./kakao-login.service";
import { CreateKakaoLoginDto } from "./dto/create-kakao-login.dto";
import { UpdateKakaoLoginDto } from "./dto/update-kakao-login.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwt-auth.guard";
import axios from "axios";

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

  @Post()
  create(@Body() createKakaoLoginDto: CreateKakaoLoginDto) {
    return this.kakaoLoginService.create(createKakaoLoginDto);
  }

  @Get()
  findAll() {
    return this.kakaoLoginService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.kakaoLoginService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateKakaoLoginDto: UpdateKakaoLoginDto
  ) {
    return this.kakaoLoginService.update(+id, updateKakaoLoginDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.kakaoLoginService.remove(+id);
  }
}
