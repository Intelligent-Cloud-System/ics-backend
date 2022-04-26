import { User } from 'src/model';
import { FastifyRequest, RawRequestDefaultExpression } from 'fastify';

interface RawRequest extends RawRequestDefaultExpression {
  user: User;
}

export interface Request extends FastifyRequest {
  raw: RawRequest;
}
