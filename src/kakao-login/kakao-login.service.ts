import { Injectable } from "@nestjs/common";
import { CreateKakaoLoginDto } from "./dto/create-kakao-login.dto";
import { UpdateKakaoLoginDto } from "./dto/update-kakao-login.dto";
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

  create(createKakaoLoginDto: CreateKakaoLoginDto) {
    return "This action adds a new kakaoLogin";
  }

  findAll() {
    return `This action returns all kakaoLogin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kakaoLogin`;
  }

  update(id: number, updateKakaoLoginDto: UpdateKakaoLoginDto) {
    return `This action updates a #${id} kakaoLogin`;
  }

  remove(id: number) {
    return `This action removes a #${id} kakaoLogin`;
  }
}
