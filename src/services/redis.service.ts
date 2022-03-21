import Redis from 'ioredis';

import { provideSingleton } from '../ioc/decorators';
import { TYPES } from '../constants';
import { Logger } from 'winston';
import { LoggerFactory } from '../logger';

@provideSingleton(TYPES.RedisService)
export class RedisService {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.getLogger('REDIS_SERVICE');
  }

  static instance: Redis.Redis;

  get client(): Redis.Redis {
    if (!RedisService.instance) {
      this.connect();
    }

    return RedisService.instance;
  }

  connect(): void {
    RedisService.instance = new Redis(process.env.REDIS_URL);

    RedisService.instance
      .on('error', (error) => {
        this.logger.error('Could not establish a connection with redis', { error });
      })
      .on('connect', () => {
        this.logger.info('Connected to redis successfully');
      });
  }
}
