import { Test, TestingModule } from '@nestjs/testing';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './service/room.service';

describe('ChatResolver', () => {
  let resolver: ChatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatResolver, ChatService],
    }).compile();

    resolver = module.get<ChatResolver>(ChatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
