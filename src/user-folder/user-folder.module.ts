import { Module } from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { UserFolderController } from "./user-folder.controller";
import { KakaoUserinfoModule } from "src/kakao-userinfo/kakao-userinfo.module";
import { EntitiesModule } from "src/entity.module";
import { USER_FOLDER_TOKEN } from "./interface/user-folder.interface";

@Module({
  imports: [EntitiesModule, KakaoUserinfoModule],
  controllers: [UserFolderController],
  providers: [
    {
      provide: USER_FOLDER_TOKEN,
      useClass: UserFolderService,
    },
  ],
  exports: [USER_FOLDER_TOKEN],
})
export class UserFolderModule {}
