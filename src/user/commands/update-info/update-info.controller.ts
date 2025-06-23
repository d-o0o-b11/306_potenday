import {
  Body,
  Controller,
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
import { UpdateInfoDto, UpdateInfoResponseDto } from "./update-info.dto";
import { UpdateInfoCommand } from "./update-info.command";

@ApiTags("User")
@Controller({ path: "user", version: "1" })
export class UpdateInfoController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "유저 정보 수정" })
  @ApiBearerAuth(SwaggerAuth.AUTH_AT)
  @ApiOkResponse({
    type: UpdateInfoResponseDto,
  })
  updateUserInfo(
    @User() user: UserPayload,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateInfoDto
  ) {
    return this.commandBus.execute(
      new UpdateInfoCommand(user.userId, dto.name, dto.email, dto.emailActive)
    );
  }
}
