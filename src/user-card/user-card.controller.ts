import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  InternalServerErrorException,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserCardDto } from "./dto/create-user-card.dto";
import { UpdateUserCardDto } from "./dto/update-user-card.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { FindAllUserCard } from "./dto/findAll-card.dto";
import { JwtAccessAuthGuard } from "src/kakao-oauth/jwt-access.guard";
import { CtxUser } from "src/kakao-oauth/decorator/auth.decorator";
import { JWTToken } from "src/kakao-userinfo/dto/jwt-token.dto";
import {
  USER_CARD_TOKEN,
  UserCardInterface,
} from "./interface/user-card.interface";
import { CustomNotFoundError } from "src/custom_error/custom-notfound.error";

@ApiTags("유저 카드 API")
@Controller("user-card")
export class UserCardController {
  constructor(
    @Inject(USER_CARD_TOKEN)
    private readonly userCardService: UserCardInterface
  ) {}

  @ApiOperation({
    summary: "유저 위시 카드 생성",
    description: `
    기본적으로 제공되는 폴더에 위시 카드 추가 시에는 "default_folder_id" 에 값을 담기,
    사용자가 커스텀한 폴더에 위시 카드 추가 시에는 "user_folder_id"에 값을 담기
    `,
  })
  @ApiBody({
    type: CreateUserCardDto,
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createUserCard(
    @Body() dto: CreateUserCardDto,
    @CtxUser() token: JWTToken
  ) {
    return await this.userCardService.createUserCard(dto, token.id);
  }

  @ApiOperation({
    summary: "유저 위시 카드 제목,내용 수정",
  })
  @ApiInternalServerErrorResponse({
    description: "위시 카드 제목, 내용 수정 실패",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Patch()
  async updateUserCard(@Body() dto: UpdateUserCardDto) {
    try {
      return await this.userCardService.updateUserCard(dto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary:
      "유저 위시 카드 접힌 상태 변경 true => 펼친 상태, false => 접은 상태",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Patch("folded_state/:card_id")
  async updateUserFoldedState(@Param("card_id") card_id: number) {
    try {
      return await this.userCardService.updateUserCardFolderState(card_id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new CustomNotFoundError(e.message);
      }

      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "유저 위시 카드 성공 ",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiParam({
    name: "card_id",
    description: "card_id",
    example: 1,
    type: Number,
  })
  @Post("finish/:card_id")
  async finishUserCard(@Param("card_id") card_id: number) {
    try {
      return await this.userCardService.finishUserCard(card_id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "해당 폴더에 있는 모든 위시 카드 출력",
    description:
      "default_folder_id , user_folder_id 하나의 값만 넣어서 주시면 돼요! 둘 다 넣으시면 오류 발생!!! ",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getAllCardOfFolder(
    @Query() dto: FindAllUserCard,
    @CtxUser() token: JWTToken
  ) {
    try {
      return await this.userCardService.findUserCardOfFolder(dto, token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "유저 위시 카드 삭제 ",
  })
  @ApiInternalServerErrorResponse({
    description: "위시 카드 삭제 실패",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @ApiParam({ name: "card_id", example: 1, type: Number })
  @Delete("finish/:card_id")
  async deleteUserCard(@Param("card_id") card_id: number) {
    try {
      return await this.userCardService.deleteUserCard(card_id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "유저의 모든 위시 카드 출력 ",
    description: "달성 여부는 finishDay 변수에 표시 (false , 달성한 날짜)",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get("all")
  async findAllUserCards(@CtxUser() token: JWTToken) {
    try {
      return await this.userCardService.findAllUserCard(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "검색 기능으로 유저 위시 카드 출력",
  })
  @ApiParam({
    name: "search_word",
    example: "테스트",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get("search/:search_word")
  async searchUserCards(
    @Param("search_word") search_word: string,
    @CtxUser() token: JWTToken
  ) {
    try {
      return await this.userCardService.searchAllUserCard(
        token.id,
        search_word
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: "전체 이룬 위시 갯수 + 각 폴더 별 이룬 위시 갯수 출력",
    description:
      "total_count -> 전체 이룬 위시 갯수 , folder_of_count -> 각 폴더별 이룬 위시 개수 ",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAccessAuthGuard)
  @Get("card_count")
  async finishUsreCardCount(@CtxUser() token: JWTToken) {
    try {
      return await this.userCardService.finishUserCardCount(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
