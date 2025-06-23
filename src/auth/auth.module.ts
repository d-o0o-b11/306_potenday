import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { KakaoStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import {
  ConfigurationServiceInjector,
  TokenConfigService,
} from "src/configuration";
import {
  KakaoLoginController,
  KaKaoLoginCommandHandler,
  LogoutController,
  LogoutCommandHandler,
  WithdrawalController,
  WithdrawalCommandHandler,
  TokenReissueController,
  TokenReissueCommandHandler,
} from "./commands";
import { CqrsModule } from "@nestjs/cqrs";

const command = [
  KaKaoLoginCommandHandler,
  LogoutCommandHandler,
  WithdrawalCommandHandler,
  TokenReissueCommandHandler,
];
const controller = [
  KakaoLoginController,
  LogoutController,
  WithdrawalController,
  TokenReissueController,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (tokenConfig: TokenConfigService) => ({
        secret: tokenConfig.accessTokenSecret,
        signOptions: {
          expiresIn: tokenConfig.accessTokenExpiresIn,
        },
      }),
      inject: [ConfigurationServiceInjector.TOKEN_SERVICE],
    }),
  ],
  controllers: [...controller],
  providers: [KakaoStrategy, ...command],
})
export class AuthModule {}
