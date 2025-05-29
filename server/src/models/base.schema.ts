import { Schema, SchemaOptions, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import mongooseLeanGetters from 'mongoose-lean-getters';
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
  paginateModel: boolean = false,
  aggregateModel: boolean = false
) => {
  if (!schemaDef || Object.keys(schemaDef).length === 0) {
    throw new Error('Schema must have at least one path defined');
  }

  const schema = new Schema(
    {
      deletedAt: {
        type: Date,
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
  ).add(schemaDef);

  void (paginateModel && schema.plugin(paginate));
  void (aggregateModel && schema.plugin(aggregatePaginate));
  schema.plugin(mongooseLeanVirtuals);
  schema.plugin(mongooseLeanGetters);

  return schema;
};

export const mongoIdToString = (v: Types.ObjectId) => `${v}`;

export type SchemaObjectIdType = Types.ObjectId;
export type StringOrMongoId = Types.ObjectId | string;

export const isMongoId = (
  id: string | Types.ObjectId
): id is Types.ObjectId => {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
};
