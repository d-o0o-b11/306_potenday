import { Module } from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { UserFolderController } from "./user-folder.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { UserCardEntity } from "src/user-card/entities/user-card.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DefaultFolderEntity, UserCardEntity])],
  controllers: [UserFolderController],
  providers: [UserFolderService],
})
export class UserFolderModule {}
