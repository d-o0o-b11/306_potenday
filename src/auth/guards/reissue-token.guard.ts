import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtManagerService } from "src/common";

@Injectable()
export class ReissueTokenGuard implements CanActivate {
  constructor(private readonly jwtManager: JwtManagerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException(
        "요청 헤더에 Authorization 이 존재하지 않습니다."
      );
    }

    const decoded = await this.jwtManager.decodeAccessToken(token);

    if (!decoded || !decoded.userId || !decoded.sessionId) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    request.user = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
    };

    return true;
  }
}
