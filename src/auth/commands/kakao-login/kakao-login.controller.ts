import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";
import { KakaoAuthGuard } from "../../guards";
import { Social } from "../../decorators";
import { SocialPayload } from "../../interfaces";
import { KaKaoLoginCommand } from "./kakao-login.command";
import { KaKaoLoginResponseDto } from "./kakao-login.dto";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class KakaoLoginController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: "Kakao 소셜 로그인" })
  @Get("kakao")
  @UseGuards(KakaoAuthGuard)
  @ApiOkResponse({
    description: "Kakao 소셜 로그인 성공",
    type: KaKaoLoginResponseDto,
  })
  login(@Social() user: SocialPayload) {
    return this.commandBus.execute(
      new KaKaoLoginCommand(
        user.externalId,
        user.name,
        user.profile,
        user.email
      )
    );
  }
}
