import { Test, TestingModule } from '@nestjs/testing';
import { KakaoUserinfoService } from './kakao-userinfo.service';

describe('KakaoUserinfoService', () => {
  let service: KakaoUserinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KakaoUserinfoService],
    }).compile();

    service = module.get<KakaoUserinfoService>(KakaoUserinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
