import { Test, TestingModule } from '@nestjs/testing';
import { PostRequestController } from './post-request.controller';

describe('PostController', () => {
  let controller: PostRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostRequestController],
    }).compile();

    controller = module.get<PostRequestController>(PostRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
