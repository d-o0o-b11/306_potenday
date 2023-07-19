import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  InternalServerErrorException,
  UseGuards,
  NotFoundException,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { CreateKakaoUserinfoDto } from './dto/create-kakao-userinfo.dto';
import { UpdateKakaoUserinfoDto } from './dto/update-kakao-userinfo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/kakao-oauth/jwt-access.guard';
import { CtxUser } from 'src/decorator/auth.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { JWTToken } from './dto/jwt-token.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import {
  USER_KAKAO_LOGIN_TOKEN,
  UserKaKaoLoginInterface,
} from './interface/kakao-login.interface';
import { CustomNotFoundError } from 'src/custom_error/custom-notfound.error';

@ApiTags('유저 정보 API')
@Controller('kakao-userinfo')
export class KakaoUserinfoController {
  constructor(
    @Inject(USER_KAKAO_LOGIN_TOKEN)
    private readonly kakaoUserinfoService: UserKaKaoLoginInterface
  ) {}

  @ApiOperation({
    summary: '유저 정보 데이터베이스에 저장 << 개발확인용 API >>',
  })
  @Post()
  @ApiBody({
    type: CreateKakaoUserinfoDto,
  })
  async saveKakaoUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateKakaoUserinfoDto
  ) {
    try {
      return await this.kakaoUserinfoService.saveUserInfo(dto);
    } catch (e) {
      throw new InternalServerErrorException('유저 정보 저장 로직 오류');
    }
  }

  @Get()
  @ApiOperation({
    summary: '유저 정보 출력',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  async userInfo(@CtxUser() token: JWTToken) {
    console.log('유저정보 얻어노는 과정 토큰 id확인', token.id);
    return await this.kakaoUserinfoService.findUserInfoDBId(token.id);
  }

  @ApiOperation({
    summary: 'id 이용해서 신규/기존 유저 구분  << 개발확인용 API >>',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저입니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Get('authenticate')
  async findKakaoUser(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoUserinfoService.findUserInfoDBId(token.id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new CustomNotFoundError(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary:
      'access 토큰이 만료되면 refresh 토큰을 이용해서 access 토큰 재발급',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @Post('refresh')
  async refresh(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    refreshTokenDto: RefreshTokenDto
  ) {
    const { refresh_token } = refreshTokenDto;
    try {
      const newAccessToken = (
        await this.kakaoUserinfoService.refreshTokenCheck(refresh_token)
      ).accessToken;

      return { access_token: newAccessToken };
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new CustomNotFoundError(e.message);

      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: '회원 탈퇴',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: '회원 탈퇴 실패' })
  @Delete()
  async deleteUser(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoUserinfoService.deleteUser(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: '유저 닉네임 변경',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: '회원 닉네임 수정 실패' })
  @Patch('nickname')
  async updateUserNickName(
    @CtxUser() token: JWTToken,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateKakaoUserinfoDto
  ) {
    try {
      return await this.kakaoUserinfoService.updateUserNickName(
        token.id,
        dto.user_name
      );
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new CustomNotFoundError(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: '유저 이메일 변경',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @ApiInternalServerErrorResponse({ description: '회원 이메일 수정 실패' })
  @Patch('email')
  async updateUserEmail(
    @CtxUser() token: JWTToken,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateEmailDto
  ) {
    try {
      return await this.kakaoUserinfoService.updateUserEmail(
        token.id,
        dto.user_email
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  @ApiOperation({
    summary: '회원가입 전날한사람 확인',
  })
  @Get('testtest')
  async findUserDay() {
    return await this.kakaoUserinfoService.findUserSignUpDate();
  }

  @ApiOperation({
    summary: '이메일 on/off 기능',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAccessAuthGuard)
  @Patch('email_alarm')
  async userEmailActive(@CtxUser() token: JWTToken) {
    try {
      return await this.kakaoUserinfoService.userEmailActiveUpdate(token.id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('testfind')
  async findUser() {
    // const
    return await this.kakaoUserinfoService.findUserInfoDBIdAll(1);
  }
}
