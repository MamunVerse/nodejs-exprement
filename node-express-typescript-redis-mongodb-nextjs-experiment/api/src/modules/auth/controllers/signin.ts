import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import {envConfig} from '../../../config/env.config';
import {joiValidation} from '../../../global/decorators/joi-validation.decoratore';
import {authService} from '../services/auth.service';
import {loginSchema} from '../schemes/signin';
import {IAuthDocument} from '../interfaces/auth.interface';
import {IUserDocument} from '../../user/interface/user.interface';
import {BadRequestError} from '../../../utility/error.handler.utility';
import {userService} from '../../user/service/user.service';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

    // if(existingUser){
    //   console.log('user is available : ', existingUser._id);
    // }else {
    //   console.log('user Not available');
    // }
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);



    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      envConfig.JWT_SECRET_KEY!
    );
    req.session = { jwt: userJwt };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
  }
}
