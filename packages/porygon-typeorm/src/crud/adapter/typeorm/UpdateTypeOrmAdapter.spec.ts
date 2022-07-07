import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { ConverterAsync } from '@cuaklabs/porygon';
import {
  FindManyOptions,
  FindOptionsWhere,
  QueryBuilder,
  Repository,
  UpdateQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

jest.mock('../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere');

import { findManyOptionsToFindOptionsWhere } from '../../../common/utils/typeorm/findManyOptionsToFindOptionsWhere';
import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { UpdateTypeOrmAdapter } from './UpdateTypeOrmAdapter';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(UpdateTypeOrmAdapter.name, () => {
  let queryBuilderMock: jestMock.Mocked<UpdateQueryBuilder<ModelTest>>;
  let repositoryMock: jestMock.Mocked<Repository<ModelTest>>;
  let updateQueryToFindQueryTypeOrmConverterMock: jestMock.Mocked<
    QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
  >;
  let updateQueryToSetQueryTypeOrmConverterMock: jestMock.Mocked<
    ConverterAsync<QueryTest, QueryDeepPartialEntity<ModelTest>>
  >;

  let updateTypeOrmAdapter: UpdateTypeOrmAdapter<ModelTest, QueryTest>;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(UpdateQueryBuilder.prototype) as QueryBuilder<ModelTest>,
      {
        execute: jest.fn(),
        set: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
      } as Partial<
        jestMock.Mocked<UpdateQueryBuilder<ModelTest>>
      > as jestMock.Mocked<UpdateQueryBuilder<ModelTest>>,
    );
    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      update: jest.fn(),
    } as Partial<jestMock.Mocked<Repository<ModelTest>>> as jestMock.Mocked<
      Repository<ModelTest>
    >;
    updateQueryToFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    } as Partial<
      jestMock.Mocked<QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>>
    > as jestMock.Mocked<
      QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
    >;
    updateQueryToSetQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    updateTypeOrmAdapter = new UpdateTypeOrmAdapter(
      repositoryMock,
      updateQueryToFindQueryTypeOrmConverterMock,
      updateQueryToSetQueryTypeOrmConverterMock,
    );
  });

  describe('.update()', () => {
    describe('when called and updateQueryToFindQueryTypeOrmConverter returns FindManyOptions<TModelDb>', () => {
      let queryFixture: QueryTest;
      let findQueryTypeOrmFixture: FindManyOptions<ModelTest>;
      let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;
      let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          bar: 'sample',
        };

        findOptionsWhereFixture = {
          foo: 'sample-string',
        };

        findQueryTypeOrmFixture = {
          where: findOptionsWhereFixture,
        };

        setQueryTypeOrmFixture = {
          foo: 'sample-string-modified',
        };

        updateQueryToFindQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          findQueryTypeOrmFixture as FindManyOptions<ModelTest> &
            QueryBuilder<ModelTest> &
            WhereExpressionBuilder,
        );
        updateQueryToSetQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          setQueryTypeOrmFixture,
        );

        (
          findManyOptionsToFindOptionsWhere as jestMock.Mock<
            typeof findManyOptionsToFindOptionsWhere
          >
        ).mockReturnValueOnce(findOptionsWhereFixture);

        await updateTypeOrmAdapter.update(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('shoud call updateQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('should call findManyOptionsToFindOptionsWhere()', () => {
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledTimes(1);
        expect(findManyOptionsToFindOptionsWhere).toHaveBeenCalledWith(
          findQueryTypeOrmFixture,
        );
      });

      it('shoud call updateQueryToSetQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('shoud call repository.update()', () => {
        expect(repositoryMock.update).toHaveBeenCalledTimes(1);
        expect(repositoryMock.update).toHaveBeenCalledWith(
          findOptionsWhereFixture,
          setQueryTypeOrmFixture,
        );
      });
    });

    describe('when called and updateQueryToFindQueryTypeOrmConverter returns QueryBuilder<TModelDb>', () => {
      let queryFixture: QueryTest;
      let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        queryFixture = {
          bar: 'sample',
        };

        setQueryTypeOrmFixture = {
          foo: 'sample-string-modified',
        };

        updateQueryToFindQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          queryBuilderMock as jestMock.Mocked<
            FindManyOptions<ModelTest> &
              UpdateQueryBuilder<ModelTest> &
              WhereExpressionBuilder
          >,
        );
        updateQueryToSetQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          setQueryTypeOrmFixture,
        );

        await updateTypeOrmAdapter.update(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('shoud call updateQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture, queryBuilderMock);
      });

      it('shoud call updateQueryToSetQueryTypeOrmConverter.convert()', () => {
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          updateQueryToSetQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('shoud call queryBuilder.set()', () => {
        expect(queryBuilderMock.set).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.set).toHaveBeenCalledWith(
          setQueryTypeOrmFixture,
        );
      });

      it('shoud call queryBuilder.execute()', () => {
        expect(queryBuilderMock.execute).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.execute).toHaveBeenCalledWith();
      });
    });
  });
});
