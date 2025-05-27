import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { getConfigService } from './services/config.service';
import { logRequestSummary } from './services/logger.service';
import { setRequestId } from './middlewares/set-req-id';
import * as errorHandler from './middlewares/error-handler';
import { getContainer } from './ioc/config';

import type { Container } from 'inversify';

export class App {
  constructor(
    private app: Application,
    private _container: Container
  ) {}

  setUpPreMiddlewares() {
    const { WHITELISTED_ORIGINS } = getConfigService().getEnvVariable();

    this.app.use(
      setRequestId(),
      helmet(),
      cors({
        origin: (
          reqOrigin: string | undefined,
          callback: (err: Error | null, origin: boolean) => void
        ) => {
          const isWhitelisted = WHITELISTED_ORIGINS.some(
            (o: string) => o.toLowerCase() === reqOrigin?.toLowerCase()
          );
          if (isWhitelisted || !reqOrigin) {
            callback(null, true);
          } else {
            callback(
              new Error(`Origin ${reqOrigin} is not allowed by CORS policy`),
              false
            );
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
      }),
      express.json({ limit: '1mb' }),
      express.urlencoded({ extended: true, limit: '1mb' }),
      compression(),
      logRequestSummary
    );
  }

  setUpRouters() {
    this.app.get('/health', (_req: express.Request, res: express.Response) => {
      res.status(200).json({ status: 'ok' });
    });

    //use container here

    // this.app.use('/api/v1');
    // this.app.use('api/webhooks');
  }

  setUpPostMiddlewares() {
    this.app.use(errorHandler.handleRouteNotFound);
    this.app.use(errorHandler.handleRequestErrors());
  }

  init() {
    this.setUpPreMiddlewares();
    this.setUpRouters();
    this.setUpPostMiddlewares();
    return this.app;
  }
}

export const app = new App(express(), getContainer());
