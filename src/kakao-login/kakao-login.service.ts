import { Injectable } from "@nestjs/common";
import { CreateKakaoLoginDto } from "./dto/create-kakao-login.dto";
import { UpdateKakaoLoginDto } from "./dto/update-kakao-login.dto";

@Injectable()
export class KakaoLoginService {
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
