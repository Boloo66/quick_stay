import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import { appLogger } from '../services/logger.service';
import { RequestError } from '../shared/errors';

export function handleRequestErrors(): ErrorRequestHandler {
  return (
    error: RequestError,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ) => {
    appLogger.error((error as Error).message, { cause: error.cause, ...error });

    if (res.statusCode >= 405) {
      //send to slack
    }

    res.status(error.statusCode || 500).json({
      message: error.message,
      status: 'error',
    });
  };
}

export const handleRouteNotFound: RequestHandler = (req, res): void => {
  const errorMessage = `Cannot ${req.method.toUpperCase()} ${req.path}`;

  appLogger.error(errorMessage, {
    name: 'RouteNotFoundError',
    cause: errorMessage,
  });

  res.status(404).json({
    message: errorMessage,
    status: 'error',
  });
};
