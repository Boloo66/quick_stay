import { Schema, SchemaOptions, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IBaseModel {
  id: string;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
    versionKey: false,
    useProjection: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    useProjection: true,
  },
  versionKey: false,
  selectPopulatedPaths: false,
};

export const mergeWithBaseSchema = (
  schemaDef: Schema,
  customSchemaOptions: Partial<SchemaOptions> = {},
  paginate: boolean = false,
  aggregate: boolean = false
) => {
  if (!schemaDef || Object.keys(schemaDef.paths).length === 0) {
    throw new Error('Schema must have at least one path defined');
  }

  const schema = new Schema(
    {
      ...schemaDef.obj,
      deletedAt: {
        type: Date,
        default: null,
      },
      __v: {
        type: Number,
        select: false,
      },
    },
    {
      ...defaultSchemaOptions,
      ...customSchemaOptions,
    }
  );

  paginate && schema.plugin(paginate);
  aggregate && schema.plugin;
};
