import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomForbiddenException } from "src/custom_error/customForbiddenException.error";

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
        throw new CustomForbiddenException();
        return false;
      }

      request.user = decodedToken.id;
      return decodedToken.id;
    } catch (err) {
      return false;
    }
  }
}
