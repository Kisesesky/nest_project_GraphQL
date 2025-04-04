import { Test, TestingModule } from '@nestjs/testing';
import { HashtagResolver } from './hashtag.resolver';
import { HashtagService } from './hashtag.service';

describe('HashtagResolver', () => {
  let resolver: HashtagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashtagResolver, HashtagService],
    }).compile();

    resolver = module.get<HashtagResolver>(HashtagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
