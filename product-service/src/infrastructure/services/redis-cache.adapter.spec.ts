import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('RedisCacheAdapter', () => {
  let adapter: RedisCacheAdapter;
  let cacheManager: Cache;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheAdapter,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    adapter = module.get<RedisCacheAdapter>(RedisCacheAdapter);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('get', () => {
    it('should call cacheManager.get with the correct key', async () => {
      mockCacheManager.get.mockResolvedValue('cached-value');

      const result = await adapter.get('my-key');

      expect(cacheManager.get).toHaveBeenCalledWith('my-key');
      expect(result).toBe('cached-value');
    });
  });

  describe('set', () => {
    it('should call cacheManager.set with correct key, value, and converted TTL', async () => {
      const key = 'my-key';
      const value = 'my-value';
      const ttlSeconds = 60;
      const expectedTtlMilliseconds = 60000;

      await adapter.set(key, value, ttlSeconds);

      expect(cacheManager.set).toHaveBeenCalledWith(
        key,
        value,
        expectedTtlMilliseconds,
      );
    });
  });
});
