import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { User } from 'src/model/user';

@provide(AppService)
export class AppService {

  constructor(
    @inject(User) private readonly user: User,
  ) {}

  public async getHello(): Promise<string> {
    console.log(this.user);
    return 'Hello World!';
  }
}
