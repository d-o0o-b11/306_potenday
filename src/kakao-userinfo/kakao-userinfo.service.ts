import { Injectable } from '@nestjs/common';
import { CreateKakaoUserinfoDto } from './dto/create-kakao-userinfo.dto';
import { UpdateKakaoUserinfoDto } from './dto/update-kakao-userinfo.dto';

@Injectable()
export class KakaoUserinfoService {
  create(createKakaoUserinfoDto: CreateKakaoUserinfoDto) {
    return 'This action adds a new kakaoUserinfo';
  }

  findAll() {
    return `This action returns all kakaoUserinfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kakaoUserinfo`;
  }

  update(id: number, updateKakaoUserinfoDto: UpdateKakaoUserinfoDto) {
    return `This action updates a #${id} kakaoUserinfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} kakaoUserinfo`;
  }
}
