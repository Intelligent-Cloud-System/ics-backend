import { Injectable } from '@nestjs/common';
import { User } from 'src/model/user';

@Injectable()
export class AppService {

  public async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
