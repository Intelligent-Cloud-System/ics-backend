import { provide } from 'inversify-binding-decorators';
import { UserResponse } from 'src/interface/apiResponse';
import { User } from 'src/model/user';

@provide(UserFormatter)
export class UserFormatter {
  public toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
