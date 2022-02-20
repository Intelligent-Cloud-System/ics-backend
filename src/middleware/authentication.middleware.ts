import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from 'src/service/user.service';
import { ApplicationError } from '../shared/error/applicationError';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const authHeader = req.headers['authorization'];
    const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

    try {
      const user = await this.userService.getUserByToken(accessToken);

      Object.defineProperty(req, 'user', { value: user });

      next();
    } catch (e) {
      console.error(e);
      throw new UnauthorizedError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}

export class UnauthorizedError extends ApplicationError {}
