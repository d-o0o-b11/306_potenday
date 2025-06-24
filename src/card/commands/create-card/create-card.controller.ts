import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { CreateCardCommand } from "./create-card.command";
import { CreateCardDto } from "./create-card.dto";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class CreateCardController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 생성" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  createCard(
    @User() user: UserPayload,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateCardDto
  ) {
    return this.commandBus.execute(
      new CreateCardCommand(
        dto.title,
        dto.context,
        dto.top,
        dto.left,
        dto.folderId,
        user.userId
      )
    );
  }
}
