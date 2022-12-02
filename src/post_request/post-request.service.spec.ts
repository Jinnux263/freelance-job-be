import { Test, TestingModule } from '@nestjs/testing';
import { PostRequestService } from './post-request.service';

describe('PostService', () => {
  let service: PostRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRequestService],
    }).compile();

    service = module.get<PostRequestService>(PostRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
