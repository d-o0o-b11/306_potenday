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
import { UpdateFolderDto, UpdateFolderResponseDto } from "./update-folder.dto";
import { UpdateFolderCommand } from "./update-folder.command";

@ApiTags("Folder")
@Controller({ path: "folder", version: "1" })
export class UpdateFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(":folderId")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "폴더 수정" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: UpdateFolderResponseDto,
  })
  updateFolder(
    @User() user: UserPayload,
    @Param(ParseUUIDPipe) folderId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateFolderDto
  ) {
    return this.commandBus.execute(
      new UpdateFolderCommand(
        user.userId,
        folderId,
        dto.name,
        dto.widthName,
        dto.heightName
      )
    );
  }
}
