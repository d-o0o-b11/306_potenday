import { PartialType } from '@nestjs/swagger';
import { CreateKakaoUserinfoDto } from './create-kakao-userinfo.dto';

export class UpdateKakaoUserinfoDto extends PartialType(CreateKakaoUserinfoDto) {}
