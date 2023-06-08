import { createClient } from 'redis';
import Logger from "bunyan";
import {envConfig} from '../../config/env.config';
import {logConfig} from '../../config/log.config';


export type RedisClient = ReturnType<typeof createClient>
export abstract class BaseCache{
  client : RedisClient;
  log : Logger;
  constructor(cacheName : string) {
    this.client = createClient({url : envConfig.REDIS_HOST});
    this.log = logConfig.createLogger(cacheName);
    this.cacheError();
  }
  private cacheError() : void {
    this.client.on('error', (error : unknown) => {
      this.log.error(error);
    });
  }
}


// const client = createClient();
//
// client.on('error', err => console.log('Redis Client Error', err));
//
// await client.connect();
//
// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();
