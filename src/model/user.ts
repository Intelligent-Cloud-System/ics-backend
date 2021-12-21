import { UserRole } from 'src/entity/user.entity';
import { NEW_ID } from 'src/shared/util/util';

export class User {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole = UserRole.User,
    public readonly id: number = NEW_ID
  ) {}
}
