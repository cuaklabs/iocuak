import { ConverterAsync } from '@cuaklabs/porygon';
import { FindManyOptions, QueryBuilder, WhereExpressionBuilder } from 'typeorm';

export type QueryToFindQueryTypeOrmConverter<TModelDb, TQuery> =
  | ConverterAsync<TQuery, FindManyOptions<TModelDb>>
  | ConverterAsync<
      TQuery,
      QueryBuilder<TModelDb> & WhereExpressionBuilder,
      QueryBuilder<TModelDb> & WhereExpressionBuilder
    >;
