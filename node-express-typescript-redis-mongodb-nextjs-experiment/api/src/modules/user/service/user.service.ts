import {UserModel} from '../models/user.schema';
import {IUserDocument} from '../interface/user.interface';


class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

}

export const userService: UserService = new UserService();
