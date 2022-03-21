import type { NextFunction, Request, Response } from 'express';

import { provideSingleton } from '../ioc/decorators';
import { TYPES } from '../constants';
import { BaseMiddleware } from 'inversify-express-utils';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';

@provideSingleton(TYPES.AdminCheckMiddleware)
export class AdminCheckMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction): void {
    this.httpContext.user.isInRole('admin').then((isAdmin) => {
      if (!isAdmin) {
        next(new HttpError('User is not admin', HttpStatusCode.Forbidden));
      }
      next();
    });
  }
}
