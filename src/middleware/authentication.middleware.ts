import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { iocContainer } from 'src/ioc';
import { User } from 'src/model/user';
import { AccountService } from 'src/service/account.service';

export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const container = iocContainer();
    const childContainer = container.createChild();
    Object.defineProperty(req, 'childContainer', { value: childContainer });

    console.log(req.headers);

    const authHeader = req.headers['authorization'];
    const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

    const user: User = await container.get(AccountService).getUserByToken(accessToken);
    childContainer.bind<User>(User).toConstantValue(user);

    next();
  }
}
