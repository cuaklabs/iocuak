import { ConverterAsync, CreateEntityPort } from '@cuaklabs/porygon';
import {
  Repository,
  InsertResult,
  ObjectLiteral,
  FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class InsertTypeOrmAdapter<TModel, TModelDb, TQuery>
  implements CreateEntityPort<TModel, TQuery>
{
  readonly #repository: Repository<TModelDb>;
  readonly #modelDbToModelConverter: ConverterAsync<TModelDb, TModel>;
  readonly #queryToSetTypeOrmQueryConverter: ConverterAsync<
    TQuery,
    QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
  >;

  constructor(
    repository: Repository<TModelDb>,
    modelDbToModelConverter: ConverterAsync<TModelDb, TModel>,
    queryToSetTypeOrmQueryConverter: ConverterAsync<
      TQuery,
      QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
    >,
  ) {
    this.#repository = repository;
    this.#modelDbToModelConverter = modelDbToModelConverter;
    this.#queryToSetTypeOrmQueryConverter = queryToSetTypeOrmQueryConverter;
  }

  public async insertOne(query: TQuery): Promise<TModel> {
    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] = await this.#queryToSetTypeOrmQueryConverter.convert(
      query,
    );

    const singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      this.convertToSingleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await this.#repository.insert(
      singleInsertQueryTypeOrm,
    );

    const ids: ObjectLiteral[] = insertResult.identifiers;

    const [modelDb]: [TModelDb] = (await this.findEntitiesByIds(ids)) as [
      TModelDb,
    ];

    const model: TModel = await this.#modelDbToModelConverter.convert(modelDb);

    return model;
  }

  private async findEntitiesByIds(ids: ObjectLiteral[]): Promise<TModelDb[]> {
    const findManyOptions: FindManyOptions = {
      where: ids,
    };

    const modelDbs: TModelDb[] = await this.#repository.find(findManyOptions);

    return modelDbs;
  }

  private convertToSingleInsertQueryTypeOrm(
    typeOrmQuery:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[],
  ): QueryDeepPartialEntity<TModelDb> {
    let singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb>;

    if (Array.isArray(typeOrmQuery)) {
      if (typeOrmQuery.length === 1) {
        // eslint-disable-next-line @typescript-eslint/typedef
        [singleInsertQueryTypeOrm] = typeOrmQuery as [
          QueryDeepPartialEntity<TModelDb>,
        ];
      } else {
        throw new Error(
          'Expected a single TypeORM insert query when called .insertOne()',
        );
      }
    } else {
      singleInsertQueryTypeOrm = typeOrmQuery;
    }

    return singleInsertQueryTypeOrm;
  }
}
