import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { HotelService } from './hotel.service';
import { Request, Response, NextFunction } from 'express';
import * as authSchema from './req-schema';
import { StatusCodes } from 'http-status-codes';
import { createRequestError } from '../../shared/errors';

@injectable()
export class HotelController {
  constructor(@inject(TYPES.HotelService) private hotelService: HotelService) {}

  async create(
    req: Request<object, object, authSchema.SignUpBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.hotelService.create(req.body);
      res.status(StatusCodes.CREATED).json({
        message: 'Hotel created successfully',
        data: null,
      });
    } catch (error) {
      const errMap: Record<string, StatusCodes> = {
        DuplicateModelError: StatusCodes.CONFLICT,
      };

      const e = createRequestError(
        (error as Error).message,
        (error as Error).name,
        errMap[(error as Error).name]
      );
      next(e);
    }
  }
}
