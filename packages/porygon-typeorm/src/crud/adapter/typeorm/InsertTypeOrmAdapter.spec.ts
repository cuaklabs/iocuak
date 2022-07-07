import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { ConverterAsync } from '@cuaklabs/porygon';
import { FindManyOptions, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { InsertTypeOrmAdapter } from './InsertTypeOrmAdapter';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(InsertTypeOrmAdapter.name, () => {
  let repositoryMock: jestMock.Mocked<Repository<ModelTest>>;
  let modelDbToModelConverterMock: jestMock.Mocked<
    ConverterAsync<ModelTest, ModelTest>
  >;
  let insertQueryToInsertQueryTypeOrmConverterMock: jestMock.Mocked<
    ConverterAsync<
      QueryTest,
      QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[]
    >
  >;

  let insertTypeOrmAdapter: InsertTypeOrmAdapter<
    ModelTest,
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    repositoryMock = {
      find: jest.fn(),
      insert: jest.fn(),
    } as Partial<jestMock.Mocked<Repository<ModelTest>>> as jestMock.Mocked<
      Repository<ModelTest>
    >;

    modelDbToModelConverterMock = {
      convert: jest.fn(),
    };
    insertQueryToInsertQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    insertTypeOrmAdapter = new InsertTypeOrmAdapter(
      repositoryMock,
      modelDbToModelConverterMock,
      insertQueryToInsertQueryTypeOrmConverterMock,
    );
  });

  describe('.insertOne()', () => {
    describe('when called', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        queryFixture = {
          bar: 'sample',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        typeOrmQueryFixture = {};

        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        modelDbToModelConverterMock.convert.mockResolvedValueOnce(modelFixture);
        insertQueryToInsertQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          typeOrmQueryFixture,
        );

        result = await insertTypeOrmAdapter.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToTypeOrmQueryConverterMock.convert()', () => {
        expect(
          insertQueryToInsertQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          insertQueryToInsertQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryFixture);
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });

      it('should call repositoryMock.find()', () => {
        const expected: FindManyOptions<ModelTest> = {
          where: insertResultFixture.identifiers,
        };

        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(expected);
      });

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverterMock.convert).toHaveBeenCalledWith(
          modelFixture,
        );
      });

      it('should return an ModelTest', () => {
        expect(result).toBe(modelFixture);
      });
    });

    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity[] with one element', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;
      let typeOrmQueryFixture: QueryDeepPartialEntity<ModelTest>;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        queryFixture = {
          bar: 'sample',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        typeOrmQueryFixture = {};

        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        modelDbToModelConverterMock.convert.mockResolvedValueOnce(modelFixture);
        insertQueryToInsertQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          [typeOrmQueryFixture],
        );

        await insertTypeOrmAdapter.insertOne(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repositoryMock.insert()', () => {
        expect(repositoryMock.insert).toHaveBeenCalledTimes(1);
        expect(repositoryMock.insert).toHaveBeenCalledWith(typeOrmQueryFixture);
      });
    });

    describe('when called, and insertQueryToInsertQueryTypeOrmConverter.convert() returns a QueryDeepPartialEntity[] with not one element', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let insertResultFixture: InsertResult;

      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample-string',
        };

        queryFixture = {
          bar: 'sample',
        };

        insertResultFixture = {
          identifiers: [{ id: 'sample-id' }],
        } as Partial<InsertResult> as InsertResult;

        repositoryMock.find.mockResolvedValueOnce([modelFixture]);
        repositoryMock.insert.mockResolvedValueOnce(insertResultFixture);
        modelDbToModelConverterMock.convert.mockResolvedValueOnce(modelFixture);
        insertQueryToInsertQueryTypeOrmConverterMock.convert.mockResolvedValueOnce(
          [],
        );

        try {
          await insertTypeOrmAdapter.insertOne(queryFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        const expectedError: Partial<Error> = {
          message:
            'Expected a single TypeORM insert query when called .insertOne()',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(expect.objectContaining(expectedError));
      });
    });
  });
});
