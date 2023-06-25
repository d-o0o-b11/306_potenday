import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KakaoUserinfoService } from './kakao-userinfo.service';
import { CreateKakaoUserinfoDto } from './dto/create-kakao-userinfo.dto';
import { UpdateKakaoUserinfoDto } from './dto/update-kakao-userinfo.dto';

@Controller('kakao-userinfo')
export class KakaoUserinfoController {
  constructor(private readonly kakaoUserinfoService: KakaoUserinfoService) {}

  @Post()
  create(@Body() createKakaoUserinfoDto: CreateKakaoUserinfoDto) {
    return this.kakaoUserinfoService.create(createKakaoUserinfoDto);
  }

  @Get()
  findAll() {
    return this.kakaoUserinfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kakaoUserinfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKakaoUserinfoDto: UpdateKakaoUserinfoDto) {
    return this.kakaoUserinfoService.update(+id, updateKakaoUserinfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kakaoUserinfoService.remove(+id);
  }
}
