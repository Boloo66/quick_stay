import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { REQUEST_ID_HEADER } from '../shared/constants';
import { context } from '../shared/context';

export function setRequestId() {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers[REQUEST_ID_HEADER] as string | undefined;

    if (!requestId) {
      req.headers[REQUEST_ID_HEADER] = randomUUID();
    }

    res.setHeader(REQUEST_ID_HEADER, req.headers[REQUEST_ID_HEADER] as string);

    const currentContext = context().getStore();
    if (currentContext) {
      currentContext.requestId = requestId;
      return next();
    }

    context.arguments({ requestId }, next);
  };
}
