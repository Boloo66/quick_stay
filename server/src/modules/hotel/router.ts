import { Router } from 'express';
import { Container } from 'inversify';
import { HotelController } from './hotel.controller';
import { TYPES } from '../../ioc/types';

export function setHotelRouter(container: Container) {
  const router = Router();

  const hotelController = container.get<HotelController>(TYPES.HotelController);

  router.post('/create', hotelController.create);

  return router;
}
