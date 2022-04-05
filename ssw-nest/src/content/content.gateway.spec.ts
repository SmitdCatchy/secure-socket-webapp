import { Test, TestingModule } from '@nestjs/testing';
import { ContentGateway } from './content.gateway';

describe('ContentGateway', () => {
  let gateway: ContentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentGateway],
    }).compile();

    gateway = module.get<ContentGateway>(ContentGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
