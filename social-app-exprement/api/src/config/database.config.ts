import mongoose from 'mongoose';
import { envConfig } from './env.config';
import Logger from 'bunyan';
import { logConfig } from './log.config';
import {redisConnection} from '../global/redis/redis.connection';
const log: Logger = logConfig.createLogger('server');
export default () => {
  const URI = envConfig.DATABASE_URL;
  const OPTION = { user: '', pass: '', autoIndex: true };
  const connect = () => {
    mongoose
      .connect(URI, OPTION)
      .then((res) => {
        log.info('Database Connection Successful!');
        redisConnection.connect();
      })
      .catch((err) => {
        log.error('Database Connection Failed!', err);
        process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
