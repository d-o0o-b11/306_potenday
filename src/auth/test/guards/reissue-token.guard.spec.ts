import { JwtManagerService } from "src/common";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ReissueTokenGuard } from "../../guards";
import { Test, TestingModule } from "@nestjs/testing";

describe("ReissueTokenGuard", () => {
  let guard: ReissueTokenGuard;
  let jwtManager: JwtManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReissueTokenGuard,
        {
          provide: JwtManagerService,
          useValue: {
            decodeAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ReissueTokenGuard>(ReissueTokenGuard);
    jwtManager = module.get<JwtManagerService>(JwtManagerService);
  });

  const mockRequest = (authHeader?: string): any => ({
    headers: {
      authorization: authHeader,
    },
  });

  const mockContext = (request: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext);

  describe("canActivate", () => {
    it("정상적인 토큰이면 user 정보 주입 후 true 반환한다", async () => {
      const token = "Bearer valid.token.value";
      const request = mockRequest(token);
      const context = mockContext(request);

      const decodedPayload = {
        userId: "user-uuid",
        sessionId: "session-uuid",
      };

      const decodeAccessToken = jest
        .spyOn(jwtManager, "decodeAccessToken")
        .mockResolvedValue(decodedPayload);

      const result = await guard.canActivate(context);

      expect(decodeAccessToken).toHaveBeenCalledWith(
        token.replace("Bearer ", "")
      );
      expect(request.user).toEqual({
        userId: decodedPayload.userId,
        sessionId: decodedPayload.sessionId,
      });
      expect(result).toBe(true);
    });

    it("Authorization 헤더가 없으면 예외 발생한다", async () => {
      const request = mockRequest(undefined);
      const context = mockContext(request);

      await expect(guard.canActivate(context)).rejects.toThrowError(
        new UnauthorizedException(
          "요청 헤더에 Authorization 이 존재하지 않습니다."
        )
      );
    });

    it("decodeAccessToken 결과에 userId 또는 sessionId가 없으면 예외 발생한다", async () => {
      const token = "Bearer invalid.token";
      const request = mockRequest(token);
      const context = mockContext(request);

      const decodeAccessToken = jest
        .spyOn(jwtManager, "decodeAccessToken")
        .mockResolvedValue({
          userId: null,
          sessionId: undefined,
        });

      await expect(guard.canActivate(context)).rejects.toThrowError(
        new UnauthorizedException("유효하지 않은 토큰입니다.")
      );

      expect(decodeAccessToken).toHaveBeenCalledWith(
        token.replace("Bearer ", "")
      );
    });

    it("decodeAccessToken 결과가 null이면 예외 발생한다", async () => {
      const token = "Bearer token.without.payload";
      const request = mockRequest(token);
      const context = mockContext(request);

      const decodeAccessToken = jest
        .spyOn(jwtManager, "decodeAccessToken")
        .mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrowError(
        new UnauthorizedException("유효하지 않은 토큰입니다.")
      );

      expect(decodeAccessToken).toHaveBeenCalledWith(
        token.replace("Bearer ", "")
      );
    });
  });
});
