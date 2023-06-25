import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class KakaoLoginService {
  async logout() {
    const accessToken =
      "r5LV5aMQyGEfsXMBQyOKnUje7HasZv_HLwtlwneiCj1ymAAAAYjuHuNv"; // 로그인 후 얻은 액세스 토큰을 사용
    const url = "https://kapi.kakao.com/v1/user/logout";

    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 로그아웃 성공
      console.log("카카오 로그아웃 성공");
    } catch (error) {
      // 로그아웃 실패
      console.error("카카오 로그아웃 실패", error.response.data);
    }
  }
}
