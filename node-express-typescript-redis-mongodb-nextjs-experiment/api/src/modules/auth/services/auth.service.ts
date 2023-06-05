import {IAuthDocument} from '../interfaces/auth.interface';
import {Helpers} from '../../../utility/helper.utility';
import {AuthModel} from '../models/auth';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        {
          username: Helpers.firstLetterUppercase(username)
        },
        {
          email : Helpers.lowerCase(email)
        }
      ]
    };
    const user : IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument;
    return user;
  }
}

export const authService : AuthService = new AuthService();
