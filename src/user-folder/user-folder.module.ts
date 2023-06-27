import { Module } from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { UserFolderController } from "./user-folder.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { UserCardEntity } from "src/user-card/entities/user-card.entity";
import { UserFolderEntity } from "./entities/user-folder.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DefaultFolderEntity, UserFolderEntity])],
  controllers: [UserFolderController],
  providers: [UserFolderService],
  exports: [UserFolderService],
})
export class UserFolderModule {}
