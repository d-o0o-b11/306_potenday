import { Controller, Get, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { InfoQuery } from "./info.query";
import { InfoResponseDto } from "./info.dto";

@ApiTags("User")
@Controller({ path: "user", version: "1" })
export class InfoController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "유저 정보 조회" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: InfoResponseDto,
  })
  getUserInfo(@User() user: UserPayload) {
    return this.queryBus.execute(new InfoQuery(user.userId));
  }
}
