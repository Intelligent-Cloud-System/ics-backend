import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/service/user.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const accessToken: string = authHeader
      ? authHeader.split('Bearer ')[1]
      : '';

    const user = await this.userService.getUserByToken(accessToken);

    Object.defineProperty(req, 'user', { value: user });

    next();
  }
}
