import { User } from 'src/model';
import { Request as eRequest } from 'express';

export interface Request extends eRequest {
  user: User;
}
