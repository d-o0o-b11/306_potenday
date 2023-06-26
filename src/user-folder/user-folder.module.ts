import { Module } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { UserFolderController } from './user-folder.controller';

@Module({
  controllers: [UserFolderController],
  providers: [UserFolderService]
})
export class UserFolderModule {}
