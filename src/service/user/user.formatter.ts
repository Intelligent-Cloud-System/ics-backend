import { Injectable } from '@nestjs/common';

import { UserResponse } from 'src/interface/apiResponse';
import { User } from 'src/model';

@Injectable()
export class UserFormatter {
  public toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
