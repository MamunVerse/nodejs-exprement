import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import {logConfig} from '../../../config/log.config';
import {userService} from '../service/user.service';

const log: Logger = logConfig.createLogger('userWorker');

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const {value} = job.data;
      await userService.addUserData(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}


export const userWorker: UserWorker = new UserWorker();
