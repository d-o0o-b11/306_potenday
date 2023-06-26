import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomForbiddenException } from "../custom_error/customForbiddenException.error";

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const currentTimestamp = Math.floor(Date.now() / 1000);
      // 토큰이 만료된 경우
      if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        throw new CustomForbiddenException("만료된 토큰입니다");
        // throw new ForbiddenException("만료된 토큰입니다");
        // return false;
      }

      request.user = decodedToken.id;
      return decodedToken.id;
    } catch (err) {
      throw new CustomForbiddenException("토큰 오류 발생");
      // return false;
    }
  }
}