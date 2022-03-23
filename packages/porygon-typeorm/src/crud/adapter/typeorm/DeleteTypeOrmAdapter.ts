import { DeleteEntityPort } from '@cuaklabs/porygon';
import {
  DeleteQueryBuilder,
  FindManyOptions,
  FindOptionsWhere,
  QueryBuilder,
  Repository,
} from 'typeorm';

import { findManyOptionsToFindOptionsWhere } from '../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';

export class DeleteTypeOrmAdapter<TModelDb, TQuery>
  implements DeleteEntityPort<TQuery>
{
  readonly #repository: Repository<TModelDb>;
  readonly #queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#queryToQueryTypeOrmConverter = queryToQueryTypeOrmConverter;
  }

  public async delete(query: TQuery): Promise<void> {
    const deleteQueryBuilder: DeleteQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder()
      .delete();
    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#queryToQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, deleteQueryBuilder);

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
      await (
        findQueryTypeOrmOrQueryBuilder as DeleteQueryBuilder<TModelDb>
      ).execute();
    } else {
      const findQueryTypeOrmWhere: FindOptionsWhere<TModelDb> =
        findManyOptionsToFindOptionsWhere(findQueryTypeOrmOrQueryBuilder);

      await this.#repository.delete(findQueryTypeOrmWhere);
    }
  }
}
