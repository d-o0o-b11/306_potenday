import { Module } from "@nestjs/common";
import { UserCardService } from "./user-card.service";
import { UserCardController } from "./user-card.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCardEntity } from "./entities/user-card.entity";
import { UserFolderModule } from "src/user-folder/user-folder.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserCardEntity]), UserFolderModule],
  controllers: [UserCardController],
  providers: [UserCardService],
})
export class UserCardModule {}
