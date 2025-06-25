import { Controller, Get, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { FindCardQuery } from "./find-card.query";
import { FindCardResponseDto } from "./find-card.dto";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class FindCardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("list")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 리스트 조회" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: [FindCardResponseDto],
  })
  findCard(@User() user: UserPayload) {
    return this.queryBus.execute(new FindCardQuery(user.userId));
  }
}
