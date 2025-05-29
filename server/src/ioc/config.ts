import { request } from 'undici';
import { Container } from 'inversify';
import { TYPES } from './types';
import { ConfigService } from '../services/config.service';
import { LoggerService } from '../services/logger.service';
import { HotelRepository } from '../modules/hotel/schema';
import { HotelService } from '../modules/hotel/hotel.service';
import { setHotelRouter } from '../modules/hotel/router';
import { Router } from 'express';
import { HotelController } from '../modules/hotel/hotel.controller';

export const getContainer = function () {
  const container = new Container();

  // ------------------------ Register Others Here --------------//
  container.bind<typeof request>(TYPES.UndiciRequest).toConstantValue(request);

  // ------------------------ Register Repositories Here --------------//
  container.bind<HotelRepository>(TYPES.HotelRepository).to(HotelRepository);

  // ------------------------ Register Services Here --------------//
  container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
  container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);
  container.bind<HotelService>(TYPES.HotelService).to(HotelService);

  // ------------------------ Register Controllers Here --------------//
  container.bind<HotelController>(TYPES.HotelController).to(HotelController);

  // ------------------------- Register Routers Here --------------//
  container
    .bind<Router>(TYPES.HotelRouter)
    .toDynamicValue(() => setHotelRouter(container));

  // ------------------------- Register V1 Router Here --------------//

  container.bind<Router>(TYPES.V1Router).toDynamicValue(() => {
    const hotelRouter = container.get<Router>(TYPES.HotelRouter);

    const router = Router();

    router.use('/hotel', hotelRouter);
    return router;
  });

  return container;
};
