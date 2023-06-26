import { Injectable } from "@nestjs/common";
import axios from "axios";
import { CreateKakaoUserinfoDto } from "src/kakao-userinfo/dto/create-kakao-userinfo.dto";
import { KakaoUserinfoService } from "src/kakao-userinfo/kakao-userinfo.service";

@Injectable()
export class KakaoLoginService {
  constructor(private readonly kakaoUserInfoService: KakaoUserinfoService) {}

  async kakaoLogin(kakao_user) {
    const { accessToken, kakao_id, nickname, email, profile_image } =
      kakao_user;
    const findResult = await this.kakaoUserInfoService.findUserInfo(
      kakao_user.kakao_id
    );
    let saveResult;
    //최초 회원가입
    if (!findResult) {
      const data = new CreateKakaoUserinfoDto({
        kakao_id: kakao_id,
        user_name: nickname,
        user_img: profile_image,
        user_email: email || undefined,
        accesstoken: accessToken,
        refreshtoken: undefined,
      });
      saveResult = await this.kakaoUserInfoService.saveUserInfo(data);
    }
    const access_token = await this.kakaoUserInfoService.generateAccessToken(
      findResult.id || saveResult.id
    );
    const refresh_token = await this.kakaoUserInfoService.generateRefreshToken(
      findResult.id || saveResult.id
    );
    await this.kakaoUserInfoService.setCurrentRefreshToken(
      refresh_token,
      findResult.id || saveResult.id
    );

    return { access_token: access_token, refresh_token: refresh_token };
  }

  async logout(user_id: number) {
    const findUser = await this.kakaoUserInfoService.findUserInfoDBId(user_id);

    const accessToken = findUser.accesstoken;

    const url = "https://kapi.kakao.com/v1/user/logout";

    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("resp", response);

      return "카카오 로그아웃 성공";
    } catch (error) {
      // 로그아웃 실패
      // console.error("카카오 로그아웃 실패", error.response.data);
      throw new Error("카카오 로그아웃 실패");
    }
  }
}
