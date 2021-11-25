import { Container } from 'inversify';
import * as express from 'express';

const globalContainer = new Container();

export interface Request extends express.Request {
  childContainer: Container
}

export const iocContainer = (request ?: Request): Container => {
  if (request) {
    return request.childContainer || globalContainer;
  }

  return globalContainer;
};
