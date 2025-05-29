import { Schema } from 'mongoose';
import { Hotel } from './types';
import { mergeWithBaseSchema } from '../../models/base.schema';
import { injectable } from 'inversify';
import { BaseRepository, TModelBase } from '../../models/base.repo';

export interface HotelModel extends TModelBase, Hotel {}

let schema = new Schema<Hotel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
});

schema = mergeWithBaseSchema(schema);

@injectable()
export class HotelRepository extends BaseRepository<HotelModel> {
  constructor() {
    super('Hotel', schema);
  }
}
