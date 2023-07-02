import { Controller, Get, Options } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("연결 상태 확인 API")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Options("*")
  // handleOptions() {
  //   // preflight 요청에 대한 응답을 반환
  //   return {
  //     statusCode: 200,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*", // 허용할 도메인
  //       "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE", // 허용할 메서드
  //       "Access-Control-Allow-Headers": "*", // 허용할 헤더
  //       "Access-Control-Allow-Credentials": true, // 자격 증명 허용 여부
  //     },
  //   };
  // }

  @Get()
  @ApiOperation({
    summary:
      "처음 연결하실 때 요청 한 번 보내보세요!! Hello World 떠야지 서버 연결 성공입니다.",
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
