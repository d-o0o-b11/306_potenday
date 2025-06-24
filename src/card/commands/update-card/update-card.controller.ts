import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { UpdateCardCommand } from "./update-card.command";
import { UpdateCardDto, UpdateCardResponseDto } from "./update-card.dto";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class UpdateCardController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(":cardId")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 수정" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: UpdateCardResponseDto,
  })
  updateCard(
    @User() user: UserPayload,
    @Param("cardId", ParseUUIDPipe) cardId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateCardDto
  ) {
    return this.commandBus.execute(
      new UpdateCardCommand(
        cardId,
        user.userId,
        dto.title,
        dto.context,
        dto.top,
        dto.left,
        dto.foldedState
      )
    );
  }
}
