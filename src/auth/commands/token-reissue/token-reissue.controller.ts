import { Controller, Get, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ReissueTokenGuard } from "../../guards";
import { SwaggerAuth, User, UserPayload } from "src/common";
import { TokenReissueCommand } from "./token-reissue.command";
import { TokenReissueResponseDto } from "./token-reissue.dto";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class TokenReissueController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get("reissue")
  @UseGuards(ReissueTokenGuard)
  @ApiOperation({ summary: "토큰 재발급" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: TokenReissueResponseDto,
  })
  reissueToken(@User() user: UserPayload) {
    return this.commandBus.execute(
      new TokenReissueCommand(user.userId, user.sessionId)
    );
  }
}
