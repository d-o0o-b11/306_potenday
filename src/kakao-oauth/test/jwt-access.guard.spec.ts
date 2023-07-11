import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessAuthGuard } from "../jwt-access.guard";
import { CustomForbiddenException } from "src/custom_error/custom-forbidden.error";

describe("JwtAccessAuthGuard", () => {
  let guard: JwtAccessAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    guard = new JwtAccessAuthGuard(jwtService);

    jest.spyOn(Date, "now").mockReturnValue(new Date("2023-07-05").getTime());
  });

  describe("canActivate", () => {
    it("로그인 성공", async () => {
      const mockRequest = {
        headers: { authorization: "Bearer valid_token" },
      };

      const mockResponse = {};

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest as any,
          getResponse: () => mockResponse as any,
          getNext: () => undefined,
        }),
      } as any;

      const verifyAsyncSpy = jest
        .spyOn(jwtService, "verifyAsync")
        .mockResolvedValue({ id: 123 });

      const result = await guard.canActivate(context);

      expect(verifyAsyncSpy).toHaveBeenCalledWith("valid_token", {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      expect(result).toStrictEqual(123);
    });

    it("토큰이 없는 경우 UnauthorizedException error", async () => {
      const context: ExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: "Bearer " },
          }),
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException
      );

      await expect(
        async () => await guard.canActivate(context)
      ).rejects.toThrowError(
        new UnauthorizedException(
          "요청 헤더에 authorization 가 존재하지 않습니다."
        )
      );
    });

    it("토큰 유효시간이 지났을 경우 CustomForbiddenException error", async () => {
      const context: ExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: "Bearer expired_token" },
          }),
        }),
      } as any;

      const verifyAsyncSpy = jest
        .spyOn(jwtService, "verifyAsync")
        .mockResolvedValue({ exp: Math.floor(Date.now() / 1000) - 3600 });

      await expect(
        async () => await guard.canActivate(context)
      ).rejects.toThrowError(
        new CustomForbiddenException(
          "ForbiddenException, 접근 권한이 없습니다."
        )
      );

      expect(verifyAsyncSpy).toHaveBeenCalledWith("expired_token", {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    });

    //try-catch문 없애면서 필요없어진 테스트 코드
    // it("try문 오류로 catch문의 CustomForbiddenException error", async () => {
    //   const context: ExecutionContext = {
    //     switchToHttp: jest.fn().mockReturnValue({
    //       getRequest: jest.fn().mockReturnValue({
    //         headers: { authorization: "Bearer invalid_token" },
    //       }),
    //     }),
    //   } as any;

    //   const verifyAsyncSpy = jest
    //     .spyOn(jwtService, "verifyAsync")
    //     .mockRejectedValue(new Error("Token verification failed"));

    //   await expect(guard.canActivate(context)).rejects.toThrowError(
    //     CustomForbiddenException
    //   );
    // });
  });
});
