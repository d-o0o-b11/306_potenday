import { Controller, Get, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FindFolderResponseDto } from "./find-folder.dto";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { FindFolderQuery } from "./find-folder.query";

@ApiTags("Folder")
@Controller({ path: "folder", version: "1" })
export class FindFolderController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("list")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "폴더 리스트 조회" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: [FindFolderResponseDto],
  })
  findFolder(@User() user: UserPayload) {
    return this.queryBus.execute(new FindFolderQuery(user.userId));
  }
}
