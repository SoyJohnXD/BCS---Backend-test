import { Injectable, Inject } from '@nestjs/common';
import { ICacheService } from '@/application/ports/cache.port';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheAdapter implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Obtiene un valor de la caché de Redis.
   */
  async get(key: string): Promise<string | null> {
    const value = await this.cacheManager.get<string>(key);
    return value ?? null;
  }

  /**
   * Guarda un valor en la caché de Redis.
   * @param ttlSeconds El tiempo de expiración en segundos.
   */
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const ttlMilliseconds = ttlSeconds * 1000;
    await this.cacheManager.set(key, value, ttlMilliseconds);
  }
}
