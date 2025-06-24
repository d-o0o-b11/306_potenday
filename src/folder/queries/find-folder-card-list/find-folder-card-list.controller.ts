import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard, SwaggerAuth, User, UserPayload } from "src/common";
import { FindFolderCardListQuery } from "./find-folder-card-list.query";
import { FindFolderCardListResponseDto } from "./find-folder-card-list.dto";

@ApiTags("Folder")
@Controller({ path: "folder", version: "1" })
export class FindFolderCardListController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(":folderId/cards")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "폴더 내 카드 리스트 조회" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: [FindFolderCardListResponseDto],
  })
  findFolderCardList(
    @User() user: UserPayload,
    @Param(ParseUUIDPipe) folderId: string
  ) {
    return this.queryBus.execute(
      new FindFolderCardListQuery(user.userId, folderId)
    );
  }
}
