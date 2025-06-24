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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { UpdateStatusCardDto } from "./update-status-card.dto";
import { UpdateStatusCardCommand } from "./update-status-card.command";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class UpdateStatusCardController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(":cardId/status")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 완료 여부 수정" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  updateStatusCard(
    @User() user: UserPayload,
    @Param("cardId", ParseUUIDPipe) cardId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateStatusCardDto
  ) {
    return this.commandBus.execute(
      new UpdateStatusCardCommand(cardId, user.userId, dto.status)
    );
  }
}
