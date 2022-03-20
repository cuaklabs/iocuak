import { ConverterAsync, FindEntityPort } from '@cuaklabs/porygon';
import {
  FindManyOptions,
  FindOneOptions,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';

export class FindTypeOrmAdapter<TModel, TModelDb, TQuery>
  implements FindEntityPort<TModel, TQuery>
{
  readonly #repository: Repository<TModelDb>;
  readonly #modelDbToModelConverter: ConverterAsync<TModelDb, TModel>;
  readonly #findQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    modelDbToModelConverter: ConverterAsync<TModelDb, TModel>,
    findQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#modelDbToModelConverter = modelDbToModelConverter;
    this.#findQueryToFindQueryTypeOrmConverter =
      findQueryToFindQueryTypeOrmConverter;
  }

  public async find(query: TQuery): Promise<TModel[]> {
    const modelsDb: TModelDb[] = await this.innerFind(
      query,
      async (queryBuilder: SelectQueryBuilder<TModelDb>): Promise<TModelDb[]> =>
        queryBuilder.getMany(),
      async (findManyOptions: FindManyOptions<TModelDb>): Promise<TModelDb[]> =>
        this.#repository.find(findManyOptions),
    );

    const models: TModel[] = await Promise.all(
      modelsDb.map(async (modelDb: TModelDb) =>
        this.#modelDbToModelConverter.convert(modelDb),
      ),
    );

    return models;
  }

  public async findOne(query: TQuery): Promise<TModel | undefined> {
    const modelDb: TModelDb | undefined = await this.innerFind(
      query,
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await queryBuilder.getOne()) ?? undefined,
      async (
        findConditions: FindManyOptions<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await this.#repository.findOne(
          this.convertToFindOneOptions(findConditions),
        )) ?? undefined,
    );

    let model: TModel | undefined;

    if (modelDb === undefined) {
      model = undefined;
    } else {
      model = await this.#modelDbToModelConverter.convert(modelDb);
    }

    return model;
  }

  private convertToFindOneOptions(
    findManyOptions: FindManyOptions<TModelDb>,
  ): FindOneOptions<TModelDb> {
    return findManyOptions;
  }

  private async innerFind<TOutputDb extends undefined | TModelDb | TModelDb[]>(
    query: TQuery,
    findByQueryBuilder: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
    ) => Promise<TOutputDb>,
    findByFindManyOptions: (
      findManyOptions: FindManyOptions<TModelDb>,
    ) => Promise<TOutputDb>,
  ): Promise<TOutputDb> {
    const selectQueryBuilder: SelectQueryBuilder<TModelDb> =
      this.#repository.createQueryBuilder();

    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#findQueryToFindQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, selectQueryBuilder);

    let outputDb: TOutputDb;

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
      outputDb = await findByQueryBuilder(
        findQueryTypeOrmOrQueryBuilder as SelectQueryBuilder<TModelDb>,
      );
    } else {
      outputDb = await findByFindManyOptions(findQueryTypeOrmOrQueryBuilder);
    }

    return outputDb;
  }
}
