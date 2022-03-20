import { ConverterAsync } from '@cuaklabs/porygon';
import {
  FindManyOptions,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { FindTypeOrmAdapter } from './FindTypeOrmAdapter';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(FindTypeOrmAdapter.name, () => {
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ModelTest>>;
  let repositoryMock: jest.Mocked<Repository<ModelTest>>;
  let findQueryToFindQueryTypeOrmConverterMock: jest.Mocked<
    QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
  >;
  let modelDbToModelConverter: jest.Mocked<
    ConverterAsync<ModelTest, ModelTest>
  >;

  let findTypeOrmAdapter: FindTypeOrmAdapter<ModelTest, ModelTest, QueryTest>;

  beforeAll(() => {
    queryBuilderMock = Object.assign(
      Object.create(
        SelectQueryBuilder.prototype,
      ) as SelectQueryBuilder<ModelTest>,
      {
        getMany: jest.fn(),
        getOne: jest.fn(),
        select: jest.fn().mockReturnThis(),
      } as Partial<jest.Mocked<SelectQueryBuilder<ModelTest>>> as jest.Mocked<
        SelectQueryBuilder<ModelTest>
      >,
    );

    repositoryMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<jest.Mocked<Repository<ModelTest>>> as jest.Mocked<
      Repository<ModelTest>
    >;

    findQueryToFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    };

    modelDbToModelConverter = {
      convert: jest.fn(),
    };

    findTypeOrmAdapter = new FindTypeOrmAdapter(
      repositoryMock,
      modelDbToModelConverter,
      findQueryToFindQueryTypeOrmConverterMock,
    );
  });

  describe('.find()', () => {
    describe('when called', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        modelDbToModelConverter.convert.mockResolvedValueOnce(modelTestFixture);
        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.find.mockResolvedValueOnce(modelTestFixtures);

        result = await findTypeOrmAdapter.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture, queryBuilderMock);
      });

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return TModel[]', () => {
        expect(result).toStrictEqual(modelTestFixtures);
      });
    });

    describe('when called and findQueryToFindQueryTypeOrmConverter returns FindManyOptions<TModelDb>', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        modelDbToModelConverter.convert.mockResolvedValueOnce(modelTestFixture);
        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.find.mockResolvedValueOnce(modelTestFixtures);

        await findTypeOrmAdapter.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call repository.find()', () => {
        expect(repositoryMock.find).toHaveBeenCalledTimes(1);
        expect(repositoryMock.find).toHaveBeenCalledWith(queryTypeOrmFixture);
      });
    });

    describe('when called and findQueryToFindQueryTypeOrmConverter returns QueryBuilder<TModelDb>', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: ModelTest;
      let modelTestFixtures: ModelTest[];

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        modelTestFixtures = [modelTestFixture];
        queryTestFixture = {
          fooValue: 'bar',
        };

        modelDbToModelConverter.convert.mockResolvedValueOnce(modelTestFixture);
        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getMany.mockResolvedValueOnce(modelTestFixtures);

        await findTypeOrmAdapter.find(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryBuilder.getMany()', () => {
        expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getMany).toHaveBeenCalledWith();
      });
    });
  });

  describe('.findOne()', () => {
    describe('when called and findQueryToFindQueryTypeOrmConverter returns FindManyOptions<TModelDb> and repository.findOne() returns null', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: null;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.findOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmAdapter.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture, queryBuilderMock);
      });

      it('should call repository.findOne()', () => {
        expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(repositoryMock.findOne).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
      });

      it('should not call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverter.convert).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called and findQueryToFindQueryTypeOrmConverter returns FindManyOptions<TModelDb> and repository.findOne() returns a TModelDb', () => {
      let queryTestFixture: QueryTest;
      let queryTypeOrmFixture: FindManyOptions<ModelTest>;
      let modelTestFixture: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        queryTestFixture = {
          fooValue: 'bar',
        };
        queryTypeOrmFixture = {};

        modelDbToModelConverter.convert.mockResolvedValueOnce(modelTestFixture);
        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<FindManyOptions<ModelTest>>
          >
        ).mockResolvedValueOnce(queryTypeOrmFixture);
        repositoryMock.findOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmAdapter.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture, queryBuilderMock);
      });

      it('should call repository.findOne()', () => {
        expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
        expect(repositoryMock.findOne).toHaveBeenCalledWith(
          queryTypeOrmFixture,
        );
      });

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return TModel or undefined', () => {
        expect(result).toBe(modelTestFixture);
      });
    });

    describe('when called and findQueryToFindQueryTypeOrmConverter returns QueryBuilder<TModelDb> and repository.findOne() returns null', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: null;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = null;
        queryTestFixture = {
          fooValue: 'bar',
        };

        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmAdapter.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture, queryBuilderMock);
      });

      it('should call queryBuilder.getOne()', () => {
        expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getOne).toHaveBeenCalledWith();
      });

      it('should not call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverter.convert).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called and findQueryToFindQueryTypeOrmConverter returns QueryBuilder<TModelDb> and repository.findOne() returns a TModelDb', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: 'bar',
        };
        queryTestFixture = {
          fooValue: 'bar',
        };

        (
          findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
            Promise<QueryBuilder<ModelTest> & WhereExpressionBuilder>
          >
        ).mockResolvedValueOnce(queryBuilderMock);
        queryBuilderMock.getOne.mockResolvedValueOnce(modelTestFixture);
        modelDbToModelConverter.convert.mockResolvedValueOnce(modelTestFixture);

        result = await findTypeOrmAdapter.findOne(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findQueryToFindQueryTypeOrmConverter.convert()', () => {
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledTimes(1);
        expect(
          findQueryToFindQueryTypeOrmConverterMock.convert,
        ).toHaveBeenCalledWith(queryTestFixture, queryBuilderMock);
      });

      it('should call queryBuilder.getOne()', () => {
        expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
        expect(queryBuilderMock.getOne).toHaveBeenCalledWith();
      });

      it('should call modelDbToModelConverter.convert()', () => {
        expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(
          modelTestFixture,
        );
      });

      it('should return TModel or undefined', () => {
        expect(result).toBe(modelTestFixture);
      });
    });
  });
});
