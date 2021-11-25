import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { iocContainer } from 'src/ioc';

export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const container = iocContainer();
    const childContainer = container.createChild();
    Object.defineProperty(req, 'childContainer', { value: childContainer });

    const authHeader = req.headers['authorization'];
    const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

    // TODO: add search user by token

    // childContainer.bind<CheckClass>(CheckClass).toConstantValue(example);

    next();
  }
}
