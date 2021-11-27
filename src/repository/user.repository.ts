import { provide } from 'inversify-binding-decorators';
import { EntityManager } from 'typeorm';

import { UserEntity } from 'src/entity/user.entity';
import { User } from 'src/model/user';

@provide(UserRepository)
export class UserRepository {

  constructor(
    private manager: EntityManager,
  ) {}

  public async getByEmail(email: string): Promise<User> {
    const userEntity = await this.manager
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();

    if (userEntity) {
      return this.convertToModel(userEntity);
    }
  }

  public convertToModel(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.accountId,
      userEntity.email,
    )
  }

}
