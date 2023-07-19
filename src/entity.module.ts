import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoUserInfoEntity } from './kakao-userinfo/entities/kakao-userinfo.entity';
import { UserCardEntity } from './user-card/entities/user-card.entity';
import { DefaultFolderEntity } from './user-folder/entities/default-folder.entity';
import { UserFolderEntity } from './user-folder/entities/user-folder.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      KakaoUserInfoEntity,
      UserCardEntity,
      DefaultFolderEntity,
      UserFolderEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
