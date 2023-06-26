import { Test, TestingModule } from '@nestjs/testing';
import { UserFolderService } from './user-folder.service';

describe('UserFolderService', () => {
  let service: UserFolderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFolderService],
    }).compile();

    service = module.get<UserFolderService>(UserFolderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
