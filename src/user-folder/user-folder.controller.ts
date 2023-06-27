import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateAxisDto } from "./dto/update-axis.dto";

@ApiTags("유저 폴더 API")
@Controller("user-folder")
export class UserFolderController {
  constructor(private readonly userFolderService: UserFolderService) {}

  @ApiOperation({
    summary: "새 폴더 생성",
  })
  @ApiBody({
    type: CreateUserFolderDto,
  })
  @Post()
  async createUserFolder(@Body() dto: CreateUserFolderDto) {
    return this.userFolderService.createCustomUserFolder(dto.folder_name);
  }

  @ApiOperation({
    summary: "폴더명 수정",
  })
  @Patch()
  async updateUserFolder(@Body() dto: UpdateUserFolderDto) {
    return this.userFolderService.updateCustomUserFolder(dto);
  }

  @ApiOperation({
    summary: "유저 폴더 종류 모두 출력",
    description:
      "findDefaultFolder 배열은 기존에 제공되는 폴더명들, findCustomFolder 배열은 유저가 생성한 폴더명들",
  })
  @Get()
  async findAllUserFolder() {
    return this.userFolderService.getAllUserFoler();
  }

  @ApiOperation({
    summary: "폴더 삭제",
    description: "폴더 삭제시 폴더 안에 있는 위시 카드 모두 삭제됩니다.",
  })
  @Delete(":folder_id")
  async deleteUserFolder(@Param("folder_id") folder_id: number) {
    return this.userFolderService.deleteCustomUserFolder(folder_id);
  }

  @ApiOperation({
    summary: "폴더 축 이름 설정/수정",
    description: "폴더 삭제시 폴더 안에 있는 위시 카드 모두 삭제됩니다.",
  })
  @ApiBody({
    type: UpdateAxisDto,
  })
  @Patch()
  async updateAxis(@Body() dto: UpdateAxisDto) {
    return await this.userFolderService.updateHorizontalVerticalAxis(dto);
  }
}
