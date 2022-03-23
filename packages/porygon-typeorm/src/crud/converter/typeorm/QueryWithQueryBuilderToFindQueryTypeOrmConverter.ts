import { ConverterAsync } from '@cuaklabs/porygon';
import { FindManyOptions, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

export type QueryWithQueryBuilderToFindQueryTypeOrmConverter<TModelDb, TQuery> =
  ConverterAsync<
    TQuery,
    | FindManyOptions<TModelDb>
    | (QueryBuilder<TModelDb> & WhereExpressionBuilder),
    QueryBuilder<TModelDb> & WhereExpressionBuilder
  >;
