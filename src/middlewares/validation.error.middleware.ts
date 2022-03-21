import * as yup from 'yup';
import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '../types';
import { LoggerFactory } from '../logger';

const logger = LoggerFactory.getLogger('VALIDATION_ERRORS_MIDDLEWARE');

interface ErrorDescription {
  value?: string | number | boolean;
  param: string;
  type: string;
  message: string;
}

interface ErrorsResponse {
  [key: string]: ErrorDescription;
}

const mapValidationError = (error: yup.ValidationError): ErrorDescription => ({
  param: error.path ?? '?',
  message: error.errors.join('; '),
  type: error.type ?? '',
  value: error.value,
});

const fillValidationError = (list: ErrorsResponse, error: yup.ValidationError): void => {
  if (error.path) {
    list[error.path] = mapValidationError(error);
  }

  for (const innerError of error.inner) {
    fillValidationError(list, innerError);
  }
};

export const mapValidationErrors = (error: yup.ValidationError): ErrorsResponse => {
  const errors: ErrorsResponse = {};

  fillValidationError(errors, error);
  if (Object.keys(errors).length === 0) {
    return {
      error: mapValidationError(error),
    };
  }

  return errors;
};

export const validationErrorMiddleware = (
  err: yup.ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof yup.ValidationError) {
    const errors = mapValidationErrors(err);

    logger.warn('Validation errors', { errors });

    res.status(HttpStatusCode.BadRequest).json({
      message: 'Ошибка валидации данных',
      errors,
    });

    return;
  }

  next(err);
};
