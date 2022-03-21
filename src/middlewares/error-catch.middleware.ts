// eslint-disable-next-line node/no-extraneous-import
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';

export const errorCatchMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  let status;

  switch (err.constructor) {
    case HttpError:
      status = err.statusCode;
      break;
    default:
      status = HttpStatusCode.InternalServerError;
  }

  const resData: any = {
    message: err.message ?? 'Unresolved error',
  };

  return res.status(status).json(resData);
};
