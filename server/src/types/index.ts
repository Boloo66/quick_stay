import type { Request } from 'express';

export interface AuthenticatedRequest<Body = object, Query = object>
  extends Request<{ [key: string]: string }, object, Body, Query> {
  jwtUser: {
    id: string;
  };
}
