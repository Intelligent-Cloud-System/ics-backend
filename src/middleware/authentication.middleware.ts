import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { iocContainer } from 'src/ioc';
import { User } from 'src/model/user';
import { UserService } from 'src/service/user.service';

export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const container = iocContainer();
    const childContainer = container.createChild();
    Object.defineProperty(req, 'childContainer', { value: childContainer });

    const authHeader = req.headers['authorization'];
    const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

    const user: User = await container.get(UserService).getUserByToken(accessToken);
    childContainer.bind<User>(User).toConstantValue(user);

    next();
  }
}
