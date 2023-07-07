import { Module } from "@nestjs/common";
import { UserCardService } from "./user-card.service";
import { UserCardController } from "./user-card.controller";
import { UserFolderModule } from "src/user-folder/user-folder.module";
import { KakaoUserinfoModule } from "src/kakao-userinfo/kakao-userinfo.module";
import { EntitiesModule } from "src/entity.module";
import { USER_CARD_TOKEN } from "./interface/user-card.interface";

@Module({
  imports: [EntitiesModule, UserFolderModule, KakaoUserinfoModule],
  controllers: [UserCardController],
  providers: [
    {
      provide: USER_CARD_TOKEN,
      useClass: UserCardService,
    },
  ],
})
export class UserCardModule {}
