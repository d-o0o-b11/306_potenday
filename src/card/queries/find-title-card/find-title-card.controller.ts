import {
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import {
  FindTitleCardDto,
  FindTitleCardResponseDto,
} from "./find-title-card.dto";
import { FindTitleCardQuery } from "./find-title-card.query";

@ApiTags("Card")
@Controller({ path: "card", version: "1" })
export class FindTitleCardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "카드 title로 카드가 속한 폴더 조회" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: [FindTitleCardResponseDto],
  })
  findTitleCard(
    @User() user: UserPayload,
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    query: FindTitleCardDto
  ) {
    return this.queryBus.execute(
      new FindTitleCardQuery(query.title, user.userId)
    );
  }
}
