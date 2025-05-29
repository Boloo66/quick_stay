import { inject, injectable } from 'inversify';
import { HotelRepository } from './schema';
import { TYPES } from '../../ioc/types';

type CreateHotel = {
  name: string;
  images: Array<string>;
};

@injectable()
export class HotelService {
  constructor(@inject(TYPES.HotelRepository) private repo: HotelRepository) {}

  async create(payload: CreateHotel) {
    const hotel = await this.repo.create(payload);

    return hotel;
  }
}
