import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const mockAppService = {
    getHealth: jest.fn(() => ({ ok: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should call AppService and return its result', () => {
      const result = controller.getHealth();

      expect(result).toEqual({ ok: true });
      expect(mockAppService.getHealth).toHaveBeenCalledTimes(1);
    });
  });
});
