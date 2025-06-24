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
import { CreateFolderDto } from "./create-folder.dto";
import { CreateFolderCommand } from "./create-folder.command";

@ApiTags("Folder")
@Controller({ path: "folder", version: "1" })
export class CreateFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "폴더 생성" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  createFolder(
    @User() user: UserPayload,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateFolderDto
  ) {
    return this.commandBus.execute(
      new CreateFolderCommand(
        user.userId,
        dto.name,
        dto.widthName,
        dto.heightName
      )
    );
  }
}
