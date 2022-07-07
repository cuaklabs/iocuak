import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import {
  FindManyOptions,
  FindOptionsWhere,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

jest.mock('../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere');

import { findManyOptionsToFindOptionsWhere } from '../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { DeleteTypeOrmAdapter } from './DeleteTypeOrmAdapter';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  fooValue: unknown;
}

describe(DeleteTypeOrmAdapter.name, () => {
  let queryBuilderMock: jestMock.Mocked<
    QueryBuilder<ModelTest> & WhereExpressionBuilder
  >;
  let repositoryMock: jestMock.Mocked<Repository<ModelTest>>;
  let queryToQueryTypeOrmConverterMock: jestMock.Mocked<
    QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
  >;
  let deleteTypeOrmAdapter: DeleteTypeOrmAdapter<ModelTest, QueryTest>;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(QueryBuilder.prototype) as QueryBuilder<ModelTest>,
      {
        delete: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      } as Partial<
        jestMock.Mocked<QueryBuilder<ModelTest> & WhereExpressionBuilder>
      > as jestMock.Mocked<QueryBuilder<ModelTest> & WhereExpressionBuilder>,
    );

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      delete: jest.fn(),
    } as Partial<jestMock.Mocked<Repository<ModelTest>>> as jestMock.Mocked<
      Repository<ModelTest>
    >;

    queryToQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    } as Partial<
      jestMock.Mocked<QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>>
    > as jestMock.Mocked<
      QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
    >;

    deleteTypeOrmAdapter = new DeleteTypeOrmAdapter(
      repositoryMock,
      queryToQueryTypeOrmConverterMock,
    );
  });

  describe('.delete', () => {
    describe('when called and queryToQueryTypeOrmConverter returns FindManyOptions<ModelTest>', () => {
      let queryFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          fooValue: 'foo-value',
        };

        findOptionsWhereFixture = {};

        queryTypeOrmFixture = {
          where: findOptionsWhereFixture,
        };

        queryToQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          queryTypeOrmFixture as FindManyOptions<ModelTest> &
            QueryBuilder<ModelTest> &
            WhereExpressionBuilder,
        );

        (
          findManyOptionsToFindOptionsWhere as jestMock.Mock<
            typeof findManyOptionsToFindOptionsWhere
          >
        ).mockReturnValueOnce(findOptionsWhereFixture);

        await deleteTypeOrmAdapter.delete(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith();
      });

      it('should call queryBuilder.delete()', () => {
        expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.delete).toHaveBeenCalledWith();
      });

      it('should call queryToQueryTypeOrmConverter.convert()', () => {
        expect(queryToQueryTypeOrmConverterMock.convert).toHaveBeenCalledTimes(
          1,
        );
        expect(queryToQueryTypeOrmConverterMock.convert).toHaveBeenCalledWith(
          queryFixture,
          queryBuilderMock,
        );
      });

      it('should call findManyOptionsToFindOptionsWhere()', () => {
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledTimes(1);
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
      });

      it('should call repositoryMock.delete()', () => {
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
        expect(repositoryMock.delete).toHaveBeenCalledWith(
          findOptionsWhereFixture,
        );
      });
    });

    describe('when called and queryToQueryTypeOrmConverter returns QueryBuilder<ModelTest>', () => {
      let queryFixture: QueryTest;

      beforeAll(async () => {
        queryFixture = {
          fooValue: 'foo-value',
        };

        queryToQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          queryBuilderMock as jestMock.Mocked<
            FindManyOptions<ModelTest> &
              QueryBuilder<ModelTest> &
              WhereExpressionBuilder
          >,
        );

        await deleteTypeOrmAdapter.delete(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repository.createQueryBuilder()', () => {
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith();
      });

      it('should call queryBuilder.delete()', () => {
        expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.delete).toHaveBeenCalledWith();
      });

      it('should call queryToQueryTypeOrmConverter.convert()', () => {
        expect(queryToQueryTypeOrmConverterMock.convert).toHaveBeenCalledTimes(
          1,
        );
        expect(queryToQueryTypeOrmConverterMock.convert).toHaveBeenCalledWith(
          queryFixture,
          queryBuilderMock,
        );
      });

      it('should call queryBuilder.execute()', () => {
        expect(queryBuilderMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.execute).toHaveBeenCalledWith();
      });
    });
  });
});
