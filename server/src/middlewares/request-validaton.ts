import { ZodTypeAny } from 'zod';
import { fromZodError, ZodError } from 'zod-validation-error';
import type { Request, Response, NextFunction } from 'express';
import { createRequestError } from '../shared/errors';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../types';
import { getContainer } from '../ioc/config';
import { TYPES } from '../ioc/types';
import { LoggerService } from '../services/logger.service';

const container = getContainer();
// const authService = container.get<AuthService>(TYPES.AuthService);
const logger = container.get<LoggerService>(TYPES.LoggerService);

export function body<T extends ZodTypeAny>(schema: T) {
  return function (req: Request, _: Response, next: NextFunction) {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      const errMessage = fromZodError(error as ZodError).toString();

      const e = createRequestError(
        errMessage,
        'RequestValidationError',
        StatusCodes.UNPROCESSABLE_ENTITY
      );

      next(e);
    }
  };
}

export function query<T extends ZodTypeAny>(schema: T) {
  return function (req: Request, _: Response, next: NextFunction) {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      const errMessage = fromZodError(error as ZodError).toString();

      const e = createRequestError(
        errMessage,
        'RequestValidationError',
        StatusCodes.UNPROCESSABLE_ENTITY
      );

      next(e);
    }
  };
}

//@ts-nocheck
/* eslint-ignore */
export function authenticate() {
  return function (
    req: AuthenticatedRequest,
    _: Response,
    _next: NextFunction
  ) {
    try {
      const authourization = req.get('authourization');
      if (!authourization?.startsWith('Bearer ')) {
        throw new Error('Invalid authourization header');
      }
      const token = authourization.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      // const user = await authService.verifyToken(token);
      // if (!user) {
      //   throw new Error('Invalid token');

      // }
      // req.jwtUser = user;
      req.jwtUser = { id: 'mocked-user-id' }; // Mocking user for demonstration
      _next();
    } catch (error) {
      logger.error((error as Error).message, error);
    }
  };
}
