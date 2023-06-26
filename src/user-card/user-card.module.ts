import { Module } from '@nestjs/common';
import { UserCardService } from './user-card.service';
import { UserCardController } from './user-card.controller';

@Module({
  controllers: [UserCardController],
  providers: [UserCardService]
})
export class UserCardModule {}
