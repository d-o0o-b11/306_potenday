import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PassportStrategyName } from "../common";

@Injectable()
export class KakaoAuthGuard extends AuthGuard(PassportStrategyName.KAKAO) {}
