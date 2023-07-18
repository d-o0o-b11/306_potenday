import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  Inject,
} from "@nestjs/common";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateAxisDto } from "./dto/update-axis.dto";
import { JwtAccessAuthGuard } from "src/kakao-oauth/jwt-access.guard";
import { CtxUser } from "src/decorator/auth.decorator";
import { JWTToken } from "src/kakao-userinfo/dto/jwt-token.dto";
import {
  USER_FOLDER_TOKEN,
  UserFolderInterface,
} from "./interface/user-folder.interface";

@ApiTags("유저 폴더 API")
@Controller("user-folder")
export class UserFolderController {
  constructor(
    @Inject(USER_FOLDER_TOKEN)
    private readonly userFolderService: UserFolderInterface
  ) {}

  @ApiOperation({
    summary: "새 폴더 생성",
  })
  @ApiBody({
    type: CreateUserFolderDto,
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createUserFolder(
    @Body() dto: CreateUserFolderDto,
    @CtxUser() token: JWTToken
  ) {
    return this.userFolderService.createCustomUserFolder(
      dto.folder_name,
      token.id
    );
  }

  @ApiOperation({
    summary: "폴더명 수정",
  })
  @ApiInternalServerErrorResponse({
    description: "폴더명 수정 실패",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Patch()
  async updateUserFolder(@Body() dto: UpdateUserFolderDto) {
    try {
      return this.userFolderService.updateCustomUserFolder(dto);
    } catch (e) {
      throw new InternalServerErrorException("폴더명 수정 실패");
    }
  }

  @ApiOperation({
    summary: "유저 폴더 종류 모두 출력",
    description:
      "findDefaultFolder 배열은 기존에 제공되는 폴더명들, findCustomFolder 배열은 유저가 생성한 폴더명들",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async findAllUserFolder(@CtxUser() token: JWTToken) {
    return this.userFolderService.getAllUserFoler(token.id);
  }

  @ApiOperation({
    summary: "폴더 삭제",
    description: "폴더 삭제시 폴더 안에 있는 위시 카드 모두 삭제됩니다.",
  })
  @ApiInternalServerErrorResponse({
    description: "폴더 삭제 실패",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Delete(":folder_id")
  async deleteUserFolder(@Param("folder_id") folder_id: number) {
    try {
      return this.userFolderService.deleteCustomUserFolder(folder_id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "폴더 축 이름 설정/수정",
    description: "폴더 삭제시 폴더 안에 있는 위시 카드 모두 삭제됩니다.",
  })
  @ApiBody({
    type: UpdateAxisDto,
  })
  @ApiInternalServerErrorResponse({
    description: "폴더 축 이름 설정 실패",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Patch("updateAxis")
  async updateAxis(@Body() dto: UpdateAxisDto) {
    try {
      return await this.userFolderService.updateHorizontalVerticalAxis(dto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
