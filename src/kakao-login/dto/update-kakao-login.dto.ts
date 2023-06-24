import { PartialType } from '@nestjs/swagger';
import { CreateKakaoLoginDto } from './create-kakao-login.dto';

export class UpdateKakaoLoginDto extends PartialType(CreateKakaoLoginDto) {}
