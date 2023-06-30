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

    console.log("login2", kakao_user);

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
        accesstoken: undefined,
        refreshtoken: undefined,
      });
      saveResult = await this.kakaoUserInfoService.saveUserInfo(data);
    }
    const access_token = await this.kakaoUserInfoService.generateAccessToken(
      findResult?.id || saveResult.id
    );
    const refresh_token = await this.kakaoUserInfoService.generateRefreshToken(
      findResult?.id || saveResult.id
    );
    await this.kakaoUserInfoService.setCurrentRefreshToken(
      refresh_token,
      findResult?.id || saveResult.id
    );
    await this.kakaoUserInfoService.setKaKaoCurrentAccessToken(
      accessToken,
      findResult?.id || saveResult.id
    );

    return { access_token: access_token, refresh_token: refresh_token };
  }

  /**
   * 카카오에서 제공하는 accessToken으로 로그아웃 함
   * -> 근데,, 이거 만료되면..? 잡을 수가 없다
   * -> 차라리 로그아웃할 때 토큰 또는 Id 값을 받아서 빈값으로 바꾸는게 좋을 것 같은 => logoutTokenNull 이함수만 불러서 사용하면 됨
   * @param user_id
   * @returns
   */
  async logout(user_id: number) {
    //!!!!이렇게 비우거나 카카오에서 제공하는 url띄우거나,,둘중에 하나
    //메모장 참고
    return await this.kakaoUserInfoService.logoutTokenNull(user_id);

    //기능은 되는데 로그아웃한다고해서 동의화면으로 다시가는건 아닌 것같아서 생각 필요 -> 회원탈퇴에 들어가면 될듯
    // const findUser = await this.kakaoUserInfoService.findUserInfoDBId(user_id);

    // const accessToken = findUser.accesstoken;

    // const url = "https://kapi.kakao.com/v1/user/unlink";

    // const response = await axios.post(url, null, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // if (response.status == 200) {
    //   await this.kakaoUserInfoService.logoutTokenNull(user_id);
    //   return "카카오 로그아웃 성공";
    // } else {
    //   throw new Error("카카오 로그아웃 실패");
    // }
  }
}
