import { provide } from 'inversify-binding-decorators';


@provide(AppService)
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
