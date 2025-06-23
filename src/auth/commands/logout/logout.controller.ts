import { Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { LogoutCommand } from "./logout.command";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class LogoutController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("logout")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "로그아웃" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  logout(@User() user: UserPayload) {
    return this.commandBus.execute(
      new LogoutCommand(user.userId, user.sessionId)
    );
  }
}
