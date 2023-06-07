import {ObjectId} from 'mongodb';
import {request, Request, Response} from 'express';
import {joiValidation} from '../../../global/decorators/joi-validation.decoratore';
import {signupSchema} from '../schemes/signup';
import {IAuthDocument, ISignUpData} from '../interfaces/auth.interface';
import {authService} from '../services/auth.service';
import {BadRequestError} from '../../../utility/error.handler.utility';
import {Helpers} from '../../../utility/helper.utility';
import HTTP_STATUS from 'http-status-codes';
import {IUserDocument} from '../../user/interface/user.interface';
import {UserCache} from '../../user/redis/user.cache';
import {omit} from 'lodash';
import {authQueue} from '../queues/auth.queue';
import {userQueue} from '../../user/queues/user.queue';
import JWT from 'jsonwebtoken';
import {envConfig} from '../../../config/env.config';

const userCache : UserCache = new UserCache();

export class SignUp{

  @joiValidation(signupSchema)
  public async create(req : Request, res : Response) : Promise<void> {
    const {username, email, password, avatarColor, avatarImage} = req.body;
    const checkIfUserExist : IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if(checkIfUserExist){
       throw new BadRequestError('Invalid credentials');
    }
    const authObjectId : ObjectId = new ObjectId();
    const userObjectId : ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData : IAuthDocument = SignUp.prototype.signupData({
      _id : authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });

    // ADD TO REDIS CACHE
    const userDataForCache : IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `user-image-${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add to database
    authQueue.addAuthUserJob('addAuthUserToDB', {value : authData });
    userQueue.addUserJob('addUserToDB', {value : userDataForCache});

    const userJwt : string = SignUp.prototype.signToken(authData, userObjectId);
    request.session = {jwt : userJwt};
    res.status(HTTP_STATUS.CREATED).json({message : 'user created successfully', user : userDataForCache, token : userJwt});

  }

  private signToken(data : IAuthDocument, userObjectId : ObjectId) : string {
    return JWT.sign(
      {
        userId : userObjectId,
        uId : data.uId,
        email : data.email,
        username : data.username,
        avatarColor : data.avatarColor
      },
      envConfig.JWT_SECRET_KEY
    );
  }
  private signupData(data : ISignUpData) : IAuthDocument{
    const {_id, username, email, uId, password, avatarColor } = data;
    return {
      _id,
      uId,
      username : Helpers.firstLetterUppercase(username),
      email : Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt : new Date()
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const {_id, username, email, uId, password, avatarColor} = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
