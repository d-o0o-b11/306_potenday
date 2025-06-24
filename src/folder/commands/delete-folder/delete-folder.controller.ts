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
import { DeleteFolderCommand } from "./delete-folder.command";

@ApiTags("Folder")
@Controller({ path: "folder", version: "1" })
export class DeleteFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(":folderId")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "폴더 삭제" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  deleteFolder(
    @User() user: UserPayload,
    @Param(ParseUUIDPipe) folderId: string
  ) {
    return this.commandBus.execute(
      new DeleteFolderCommand(user.userId, folderId)
    );
  }
}
