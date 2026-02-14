import { Test, TestingModule } from '@nestjs/testing';
import { PresentsController } from './presents.controller';

describe('PresentsController', () => {
  let controller: PresentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentsController],
    }).compile();

    controller = module.get<PresentsController>(PresentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
