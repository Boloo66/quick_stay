import { injectable } from 'inversify';
import mongoose, {
  ClientSession,
  FilterQuery,
  PaginateModel,
  Schema,
  Types,
  UpdateQuery,
} from 'mongoose';
import { createServiceError } from '../shared/errors';

export interface TModelBase {
  id: string;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

type ArchiveScope = 'all' | 'active' | 'archived';

type PaginateOptions<T> = {
  limit: number;
  skip: number;
  orderBy: Partial<{ [K in keyof T]: 'asc' | 'desc' }>;
};

@injectable()
export class BaseRepository<TModel extends TModelBase> {
  private session: ClientSession | null;
  private model: PaginateModel<TModel, object, object>;

  constructor(
    private name: string,
    private schema: Schema
  ) {
    this.session = null;
    this.model = mongoose.model<TModel, PaginateModel<TModel>>(
      this.name,
      this.schema
    );
  }

  getDBModel() {
    return this.model;
  }

  private parseQuery(query: string | object) {
    if (typeof query === 'string') {
      return { _id: query };
    }
    return query;
  }

  private parseArchivedScope(scope: ArchiveScope) {
    if (scope === 'all') {
      return {
        $or: [{ deletedAt: undefined }, { deletedAt: { $ne: undefined } }],
      };
    }
    if (scope === 'active') {
      return { deletedAt: undefined };
    }
    if (scope === 'archived') {
      return { deletedAt: { $ne: undefined } };
    }
    throw new Error('Invalid scope provided');
  }

  connectSession(session: ClientSession) {
    this.session = session;

    if (session && !session.inTransaction()) {
      session.startTransaction();
    }
    return this;
  }

  disconnectSession() {
    this.session = null;
    return this;
  }

  async create<E = Omit<TModel, keyof TModelBase>>(item: Partial<E>) {
    try {
      const [doc] = await this.model.create([item], { session: this.session });
      return doc.toObject() as TModel;
    } catch (err) {
      if (err && (err as { code: number }).code === 11000) {
        const errResult = createServiceError(
          `${this.name.replaceAll('_', '')} exists already`,
          'DuplicateError'
        );

        throw errResult;
      }

      const modelName = `${this.name.replaceAll('_', '').toLowerCase()}`;
      const errMsg = 'Unable to create ' + modelName;
      const errResult = createServiceError(errMsg, 'CreateModelError');
      errResult.cause = (err as Error).message || (err as { msg: string }).msg;

      throw errResult;
    }
  }

  async getById(
    id: string,
    fields?: {
      select?: string;
      populate?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>;
    },
    archieveScope: ArchiveScope = 'active'
  ) {
    let modelName = `${this.name.replaceAll('_', '').toLowerCase()}`;
    modelName = modelName.at(0)!.toUpperCase() + modelName.slice(1);
    const notFoundMessage = modelName + ' not found';

    const doc = await this.model
      .findOne(
        {
          _id: id,
          ...this.parseArchivedScope(archieveScope),
        },
        null,
        {
          ...(fields && { ...fields }),
        }
      )
      .session(this.session)
      .lean({ virtuals: true, getters: true })
      .orFail(
        createServiceError(
          notFoundMessage,
          `${this.name.replaceAll('_', '')}NotFoundError`
        )
      );

    return doc;
  }

  async getOneOrErr(
    query: FilterQuery<TModel>,
    fields?: {
      select?: string;
      populate?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>;
    },
    archiveScope: ArchiveScope = 'active'
  ) {
    let modelName = `${this.name.replaceAll('_', ' ').toLowerCase()}`;
    modelName = modelName.at(0)!.toUpperCase() + modelName.slice(1);
    const notFoundMsg = modelName + ' not found';

    const doc = await this.model
      .findOne(
        {
          ...query,
          ...this.parseArchivedScope(archiveScope),
        },
        null,
        {
          ...(fields && { ...fields }),
        }
      )
      .session(this.session)
      .lean({
        virtuals: true,
        getters: true,
      })
      .orFail(
        createServiceError(
          notFoundMsg,
          `${this.name.replaceAll('_', '')}NotFoundError`
        )
      );

    return doc;
  }

  async getOneOrNull(
    query: FilterQuery<TModel>,
    fields?: {
      select?: string;
      populate?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>;
    },
    archiveScope: ArchiveScope = 'active'
  ) {
    const doc = await this.model
      .findOne(
        {
          ...query,
          ...this.parseArchivedScope(archiveScope),
        },
        null,
        {
          ...(fields && { ...fields }),
        }
      )
      .session(this.session)
      .lean({
        virtuals: true,
        getters: true,
      });

    return doc;
  }
  async getMany(
    query: FilterQuery<TModel>,
    fields?: {
      select?: string;
      populate?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>;
    },
    archiveScope: ArchiveScope = 'active'
  ) {
    const docs = await this.model
      .find(
        {
          ...query,
          ...this.parseArchivedScope(archiveScope),
        },
        null,
        {
          leanWithId: true,
          ...(fields && { ...fields }),
        }
      )
      .session(this.session)
      .lean({
        virtuals: true,
        getters: true,
      });

    return docs;
  }
  async list<PaginatedDocItem = TModel>(
    query: FilterQuery<TModel>,
    paginationOptions: Partial<PaginateOptions<TModel>> = {},
    fields?: {
      select?: string;
      populate?: mongoose.PopulateOptions | Array<mongoose.PopulateOptions>;
    },
    archiveScope: ArchiveScope = 'active'
  ) {
    const {
      limit = 10,
      skip = 0,
      orderBy = {
        createdAt: 'asc',
        _id: 'asc',
      },
    } = paginationOptions;

    const { docs, currentPage, nextPage, previousPage, totalDocs, totalPages } =
      await this.model.paginate(
        {
          ...query,
          ...this.parseArchivedScope(archiveScope),
        },
        {
          ...(fields && { ...fields }),
          limit: Number(limit),
          offset: Number(skip),
          sort: orderBy,
          lean: {
            getters: true,
            virtuals: true,
          } as unknown as boolean,
          leanWithId: true,
          customLabels: {
            page: 'currentPage',
            prevPage: 'previousPage',
          },
        }
      );

    return {
      docs: docs as Array<PaginatedDocItem>,
      currentPage,
      nextPage,
      previousPage,
      totalDocs,
      totalPages,
    };
  }

  async getCount(
    query: FilterQuery<TModel>,
    archiveScope: ArchiveScope = 'active'
  ) {
    const count = await this.model
      .countDocuments({
        ...query,
        ...this.parseArchivedScope(archiveScope),
      })
      .lean();

    return count;
  }

  async getDistinct(
    field: string,
    query: FilterQuery<TModel>,
    archiveScope: ArchiveScope = 'active'
  ) {
    const distinct = await this.model.distinct(field, {
      ...this.parseQuery(query),
      ...this.parseArchivedScope(archiveScope),
    });

    return distinct;
  }

  async countDistinct(
    field: string,
    query: FilterQuery<TModel>,
    archiveScope: ArchiveScope = 'active'
  ) {
    const distinct = await this.model.distinct(field, {
      ...this.parseQuery(query),
      ...this.parseArchivedScope(archiveScope),
    });

    return distinct.length;
  }

  /**
   * @throws {[ModelName]NotFoundError}
   */
  async updateOne(query: FilterQuery<TModel>, update: UpdateQuery<TModel>) {
    query = this.parseQuery(query);

    let modelName = `${this.name.replaceAll('_', ' ').toLowerCase()}`;
    modelName = modelName.at(0)!.toUpperCase() + modelName.slice(1);
    const notFoundMsg = modelName + ' not found';

    const doc = await this.model
      .findOne(query)
      .session(this.session)
      .orFail(
        createServiceError(
          notFoundMsg,
          `${this.name.replaceAll('_', '')}NotFoundError`
        )
      );

    const updated = await this.model
      .findByIdAndUpdate(doc._id, update, {
        new: true,
      })
      .session(this.session)
      .lean({
        virtuals: true,
        getters: true,
      })
      .orFail(
        createServiceError(
          notFoundMsg,
          `${this.name.replaceAll('_', '')}NotFoundError`
        )
      );

    return updated;
  }

  /**
   * @throws {[ModelName]sUpdateError}
   */
  async updateMany(query: FilterQuery<TModel>, update: UpdateQuery<TModel>) {
    query = this.parseQuery(query);

    const result = await this.model
      .updateMany(query, update, {
        runValidators: true,
      })
      .orFail(
        createServiceError(
          `Error occurred updating ${this.model.name}s`,
          `${this.model.name}sUpdateError`
        )
      )
      .session(this.session);

    return result;
  }

  async archiveAll(query: FilterQuery<TModel>) {
    query = this.parseQuery(query);

    const result = await this.model
      .updateMany(query, {
        $set: {
          deletedAt: new Date(),
        },
      })
      .session(this.session);

    return result;
  }

  /**
   * Permanently removes document(s) from the collection
   */
  async destroyAll(query: FilterQuery<TModel>) {
    query = this.parseQuery(query);
    await this.model.deleteMany(query).session(this.session);
  }
}
