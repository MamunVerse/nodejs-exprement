import { Application } from 'express';
// import userRouter from './user.route';
// import otpRoute from './otp.route';
// import taskRouter from './task.route';
import {authRoutes} from '../modules/auth/routes/auth.route';

const BASE_PATH = '/api/v1/';
const appRoutes = (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoutes.routes());
    // app.use(BASE_PATH, otpRoute);
    // app.use(BASE_PATH, taskRouter);
  };
  routes();
};
export default appRoutes;
