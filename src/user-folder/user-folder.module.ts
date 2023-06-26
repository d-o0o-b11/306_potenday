import { Module } from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { UserFolderController } from "./user-folder.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserFolder } from "./entities/user-folder.entity";
import { DefaultFolderEntity } from "./entities/default-folder.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DefaultFolderEntity, UserFolder])],
  controllers: [UserFolderController],
  providers: [UserFolderService],
})
export class UserFolderModule {}
