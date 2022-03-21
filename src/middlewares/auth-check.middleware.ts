import type { NextFunction, Request, Response } from 'express';

import { provideSingleton } from '../ioc/decorators';
import { TYPES } from '../constants';
import { BaseMiddleware } from 'inversify-express-utils';
import { inject } from 'inversify';
import { AuthService } from '../services';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { Logger } from 'winston';
import { LoggerFactory } from '../logger';

@provideSingleton(TYPES.AuthCheckMiddleware)
export class AuthCheckMiddleware extends BaseMiddleware {
  private logger: Logger;

  constructor() {
    super();
    this.logger = LoggerFactory.getLogger('AUTH_CHECK_MIDDLEWARE');
  }

  @inject(TYPES.AuthService)
  private readonly authService!: AuthService;

  public handler(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers.token || typeof req.headers.token !== 'string') {
      throw new HttpError(
        'No authorisation header provided',
        HttpStatusCode.Unauthorized
      );
    }
    this.authService
      .getUserByToken(req.headers.token)
      .then((user) => {
        this.httpContext.user.isInRole = async (role: string) => {
          switch (role) {
            case 'admin':
              return user.isAdmin;
            default:
              throw new TypeError('Unknown user role');
          }
        };
        this.httpContext.user.isAuthenticated = async () => true;
        this.httpContext.user.details = {
          name: user.name,
        };
        next();
      })
      .catch((err) => {
        this.logger.error('Error while trying to get user by token', {
          message: err.message,
        });
        next(new HttpError('Wrong user token', HttpStatusCode.Unauthorized));
      });
  }
}
