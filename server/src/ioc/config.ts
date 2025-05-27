import { request } from 'undici';
import { Container } from 'inversify';
import { TYPES } from './types';
import { ConfigService } from '../services/config.service';
import { LoggerService } from '../services/logger.service';

export const getContainer = function () {
  const container = new Container();

  container.bind<typeof request>(TYPES.UndiciRequest).toConstantValue(request);
  container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
  container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);

  return container;
};
