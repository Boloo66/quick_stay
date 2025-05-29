import { Router } from 'express';
import { Container } from 'inversify';
import { setHotelRouter } from '../modules/hotel/router';

export default function (container: Container) {
  const router = Router();

  router.use('/hotel', setHotelRouter(container));

  return router;
}
