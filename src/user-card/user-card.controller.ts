import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserCardService } from "./user-card.service";
import { CreateUserCardDto } from "./dto/create-user-card.dto";
import { UpdateUserCardDto } from "./dto/update-user-card.dto";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("유저 카드 API")
@Controller("user-card")
export class UserCardController {
  constructor(private readonly userCardService: UserCardService) {}

  @ApiOperation({
    summary: "유저 위시 카드 생성",
  })
  @ApiBody({
    type: CreateUserCardDto,
  })
  @Post()
  async createUserCard(@Body() dto: CreateUserCardDto) {
    return await this.userCardService.createUserCard(dto);
  }

  @ApiOperation({
    summary: "유저 위시 카드 제목,내용 수정",
  })
  @Patch()
  async updateUserCard(@Body() dto: UpdateUserCardDto) {
    return await this.userCardService.updateUserCard(dto);
  }

  @ApiOperation({
    summary: "유저 위시 카드 성공 ",
  })
  @ApiParam({ name: "card_id", example: 1, type: Number })
  @Post("finish:card_id")
  async finishUserCard(@Param("card_id") card_id: number) {
    return await this.userCardService.finishUserCard(card_id);
  }

  @ApiOperation({
    summary: "해당 폴더에 있는 모든 위시 카드 출력",
  })
  @Get(":folder_id")
  async getAllCardOfFolder(@Param("folder_id") folder_id: number) {
    return await this.userCardService.findUserCardOfFolder(folder_id);
  }

  @ApiOperation({
    summary: "유저 위시 카드 삭제 ",
  })
  @ApiParam({ name: "card_id", example: 1, type: Number })
  @Delete("finish:card_id")
  async deleteUserCard(@Param("card_id") card_id: number) {
    return await this.userCardService.deleteUserCard(card_id);
  }
}
