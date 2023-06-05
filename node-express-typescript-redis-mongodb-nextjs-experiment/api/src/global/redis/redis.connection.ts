import Logger from 'bunyan';
import {logConfig} from '../../config/log.config';
import {BaseCache} from './base.cache';

const log: Logger = logConfig.createLogger('redisConnection');

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      log.info(`Redis connection: ${await this.client.ping()}`);
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
