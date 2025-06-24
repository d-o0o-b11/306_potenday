import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { DeleteCardCommand } from "./delete-card.command";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class DeleteCardController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(":cardId")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 삭제" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  deleteCard(
    @User() user: UserPayload,
    @Param("cardId", ParseUUIDPipe) cardId: string
  ) {
    return this.commandBus.execute(new DeleteCardCommand(cardId, user.userId));
  }
}
