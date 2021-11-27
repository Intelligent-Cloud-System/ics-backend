import { provide } from 'inversify-binding-decorators';

@provide(User)
export class User {

  public readonly id: number;
  public readonly accountId: number;
  public readonly email: string;

  constructor(
    id: number,
    accountId: number,
    email: string,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.email = email;
  }
}
