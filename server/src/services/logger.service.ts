import morgan from 'morgan';
import winston from 'winston';
import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc/types';
import { ConfigService } from './config.service';
import { context } from '../shared/context';

const { combine, errors, json, timestamp, colorize } = winston.format;

@injectable()
export class LoggerService {
  private logger: Readonly<ReturnType<typeof winston.createLogger>>;

  constructor(@inject(TYPES.ConfigService) private config: ConfigService) {
    const { NODE_ENV } = this.config.getEnvVariable();

    this.logger =
      NODE_ENV !== 'test'
        ? winston.createLogger({
            level: 'debug',
            levels: winston.config.npm.levels,
            format: combine(
              this.addRequestId(),
              timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
              errors({ stack: true }),
              json({ space: 2 }),
              colorize({
                all: true,
                colors: {
                  info: 'gray',
                  debug: 'blue',
                  warn: 'yellow',
                  error: 'red',
                  http: 'blue',
                },
              })
            ),
            transports: [
              new winston.transports.Console(),
              new winston.transports.File({
                level: 'error',
                filename: 'logs/error.log',
                format: combine(
                  timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
                  json({ space: 2 })
                ),
              }),
            ],
          })
        : winston.createLogger({ silent: true });
  }

  private addRequestId() {
    return winston.format((info) => {
      const requestId =
        info.requestId || (context().getStore()?.requestId as string);

      info.requestId = requestId || 'unknown';
      return info;
    })();
  }

  info(message: string, meta?: Record<string, number | string | boolean>) {
    const logger = this.logger.child({});
    logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, number | string | boolean>) {
    const logger = this.logger.child({});
    logger.warn(message, meta);
  }

  error(
    message: string,
    meta?:
      | Record<string, number | string>
      | (unknown & { cause?: string })
      | unknown
      | Error
  ) {
    const logger = this.logger.child({});
    if (meta instanceof Error) {
      logger.error(message, { error: meta.message, stack: meta.stack });
    } else {
      logger.error(message, meta);
    }
  }

  getLogger() {
    return this.logger;
  }
}

export const appLogger = new LoggerService(new ConfigService());

const logHttp = new LoggerService(new ConfigService()).getLogger().http;

export const logRequestSummary = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      responseTime: tokens['response-time'](req, res),
      requestId: context().getStore()?.requestId || 'unknown',
      // @ts-expect-error It can be undefined if Clerk is not used
      userId: req.jwtUser?.id || 'clerk-anonymous-user',
      status: Number(tokens.status(req, res) || '500'),
      response_time: tokens['response-time'](req, res) + 'ms',
    });
  },
  {
    stream: {
      write: (message) => {
        const logMessage = JSON.parse(message);
        logHttp(logMessage);
      },
    },
  }
);
