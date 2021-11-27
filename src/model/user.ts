import { provide } from 'inversify-binding-decorators';

@provide(User)
export class User {

  constructor(
      public readonly id: number,
      public readonly accountId: number,
      public readonly email: string,
    ) {
  
    }
}
