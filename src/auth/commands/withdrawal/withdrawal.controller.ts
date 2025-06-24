import { Controller, Delete, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { WithdrawalCommand } from "./withdrawal.command";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class WithdrawalController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete("withdrawal")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "회원탈퇴" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  withdrawal(@User() user: UserPayload) {
    return this.commandBus.execute(new WithdrawalCommand(user.userId));
  }
}
