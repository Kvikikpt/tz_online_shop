import { inject } from 'inversify';

import { provideSingleton } from '../ioc/decorators';
import { TYPES } from '../constants';

import type { RedisService } from '../services';
import type { Cached } from '../types';

@provideSingleton(TYPES.CacheManager)
export class CacheManager {
  @inject(TYPES.RedisService)
  private readonly redisService!: RedisService;

  public async process<T>(
    key: string,
    seconds: number,
    getter: () => Promise<T> | T | undefined
  ): Promise<Cached<T> | undefined> {
    let cachedRaw = await this.redisService.client.get(key);
    if (cachedRaw === '') {
      return;
    }

    const cached = cachedRaw === null ? null : JSON.parse(cachedRaw);
    if (cached !== null) {
      return cached;
    }

    const value = await getter();

    await this.redisService.client.setex(
      key,
      seconds,
      value === undefined ? '' : JSON.stringify(value)
    );

    return value as Cached<T> | undefined;
  }
}
