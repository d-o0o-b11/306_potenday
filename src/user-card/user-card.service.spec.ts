import { Test, TestingModule } from '@nestjs/testing';
import { UserCardService } from './user-card.service';

describe('UserCardService', () => {
  let service: UserCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCardService],
    }).compile();

    service = module.get<UserCardService>(UserCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
