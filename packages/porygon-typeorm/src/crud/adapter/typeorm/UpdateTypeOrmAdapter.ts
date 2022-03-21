import { ConverterAsync, UpdateEntityPort } from '@cuaklabs/porygon';
import {
  FindManyOptions,
  QueryBuilder,
  Repository,
  UpdateQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { findManyOptionsToFindOptionsWhere } from '../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';

export class UpdateTypeOrmAdapter<TModelDb, TQuery>
  implements UpdateEntityPort<TQuery>
{
  readonly #repository: Repository<TModelDb>;
  readonly #updateQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;
  readonly #updateQueryToSetQueryTypeOrmConverter: ConverterAsync<
    TQuery,
    QueryDeepPartialEntity<TModelDb>
  >;

  constructor(
    repository: Repository<TModelDb>,
    updateQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
    updateQueryToSetQueryTypeOrmConverter: ConverterAsync<
      TQuery,
      QueryDeepPartialEntity<TModelDb>
    >,
  ) {
    this.#repository = repository;
    this.#updateQueryToFindQueryTypeOrmConverter =
      updateQueryToFindQueryTypeOrmConverter;
    this.#updateQueryToSetQueryTypeOrmConverter =
      updateQueryToSetQueryTypeOrmConverter;
  }

  public async update(query: TQuery): Promise<void> {
    const updateQueryBuilder: UpdateQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder()
      .update();
    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#updateQueryToFindQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, updateQueryBuilder);
    const setQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      await this.#updateQueryToSetQueryTypeOrmConverter.convert(query);

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
      await (findQueryTypeOrmOrQueryBuilder as UpdateQueryBuilder<TModelDb>)
        .set(setQueryTypeOrm)
        .execute();
    } else {
      await this.#repository.update(
        findManyOptionsToFindOptionsWhere(findQueryTypeOrmOrQueryBuilder),
        setQueryTypeOrm,
      );
    }
  }
}
