import 'reflect-metadata';

import path from 'path';

import {
  Column,
  ColumnType,
  DataSource,
  DataSourceOptions,
  Entity,
  FindManyOptions,
  Not,
  PrimaryColumn,
  QueryRunner,
  Repository,
  Table,
  TableColumn,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converter/typeorm/QueryToFindQueryTypeOrmConverter';
import { DeleteTypeOrmAdapter } from './DeleteTypeOrmAdapter';

function getModelTestTable(fooColumnName: string, idColumnName: string): Table {
  const modelTestTableName: string = 'model_test';

  const modelTestTable: Table = new Table({
    columns: [
      {
        isPrimary: false,
        length: '128',
        name: fooColumnName,
        type: 'varchar',
      },
      {
        isPrimary: true,
        length: '36',
        name: idColumnName,
        type: 'varchar',
      },
    ],
    name: modelTestTableName,
  });

  return modelTestTable;
}

async function setupModelTestTable(
  queryRunner: QueryRunner,
  modelTestTable: Table,
): Promise<void> {
  await tearDownModelTestTable(queryRunner, modelTestTable);

  await queryRunner.createTable(modelTestTable);
}

async function tearDownModelTestTable(
  queryRunner: QueryRunner,
  modelTestTable: Table,
): Promise<void> {
  if (await queryRunner.hasTable(modelTestTable)) {
    await queryRunner.dropTable(modelTestTable);
  }
}

function decorateModelTest(
  modelTestTable: Table,
  fooColumnName: keyof ModelTest,
  idColumnName: keyof ModelTest,
): void {
  const idColumn: TableColumn = modelTestTable.columns.find(
    (tableColumn: TableColumn) => tableColumn.name === idColumnName,
  ) as TableColumn;
  const fooColumn: TableColumn = modelTestTable.columns.find(
    (tableColumn: TableColumn) => tableColumn.name === fooColumnName,
  ) as TableColumn;

  PrimaryColumn({
    length: idColumn.length,
    name: idColumn.name,
    type: idColumn.type as ColumnType,
  })(ModelTest.prototype, idColumn.name);

  Column({
    length: fooColumn.length,
    name: fooColumn.name,
    type: fooColumn.type as ColumnType,
  })(ModelTest.prototype, fooColumn.name);

  Entity(modelTestTable.name)(ModelTest);
}

class ModelTest {
  public id!: string;
  public foo!: string;
}

interface QueryTest {
  fooValue: string;
}

describe(DeleteTypeOrmAdapter.name, () => {
  let modelTestTable: Table;
  let datasource: DataSource;
  let queryRunner: QueryRunner;

  let modelTestRepository: Repository<ModelTest>;
  let queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    ModelTest,
    QueryTest
  >;

  let deleteTypeOrmAdapter: DeleteTypeOrmAdapter<ModelTest, QueryTest>;

  beforeAll(async () => {
    const fooColumnName: keyof ModelTest = 'foo';
    const idColumnName: keyof ModelTest = 'id';

    modelTestTable = getModelTestTable(fooColumnName, idColumnName);

    decorateModelTest(modelTestTable, fooColumnName, idColumnName);

    const datasourceOptions: DataSourceOptions = {
      database: path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'tmp',
        'typeorm',
        'DeleteTypeOrmAdapter.sqlite',
      ),
      entities: [ModelTest],
      logging: false,
      type: 'sqlite',
    };

    datasource = new DataSource(datasourceOptions);

    await datasource.initialize();

    queryRunner = datasource.createQueryRunner();

    await setupModelTestTable(queryRunner, modelTestTable);

    modelTestRepository = datasource.getRepository(ModelTest);
    queryToQueryTypeOrmConverter = {
      convert: jest.fn(),
    };

    deleteTypeOrmAdapter = new DeleteTypeOrmAdapter<ModelTest, QueryTest>(
      modelTestRepository,
      queryToQueryTypeOrmConverter,
    );
  });

  describe('.delete', () => {
    describe('having a model', () => {
      let modelTest: ModelTest;

      beforeAll(() => {
        modelTest = new ModelTest();
        modelTest.id = '836d2558-0f11-4c63-beb9-e78edba50428';
        modelTest.foo = 'some foo value';
      });

      describe('when called, and model is on db and queryToFindQueryTypeOrmConverter.convert returns a typeorm find query matching a ModelTest', () => {
        beforeAll(async () => {
          await modelTestRepository.save(modelTest);

          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: modelTest.id,
            },
          };

          (
            queryToQueryTypeOrmConverter.convert as jest.Mock<
              Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          await deleteTypeOrmAdapter.delete(queryTest);
        });

        afterAll(async () => {
          await modelTestRepository.delete({
            id: modelTest.id,
          });

          jest.clearAllMocks();
        });

        describe('when called and modelTestRepository.findOne() with a typeorm find query matching the ModelTest', () => {
          let result: unknown;

          beforeAll(async () => {
            const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
              where: {
                id: modelTest.id,
              },
            };

            result = await modelTestRepository.findOne(queryTypeOrmFixture);
          });

          it('should return null', () => {
            expect(result).toBeNull();
          });
        });
      });

      describe('when called, and model is on db and queryToFindQueryTypeOrmConverter.convert returns a typeorm find query not matching a ModelTest', () => {
        beforeAll(async () => {
          await modelTestRepository.save(modelTest);

          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: Not(modelTest.id),
            },
          };

          (
            queryToQueryTypeOrmConverter.convert as jest.Mock<
              Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          await deleteTypeOrmAdapter.delete(queryTest);
        });

        afterAll(async () => {
          await modelTestRepository.delete({
            id: modelTest.id,
          });

          jest.clearAllMocks();
        });

        describe('when called modelTestRepository.findOne() with a typeorm find query matching the ModelTest', () => {
          let result: unknown;

          beforeAll(async () => {
            const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
              where: {
                id: modelTest.id,
              },
            };

            result = await modelTestRepository.findOne(queryTypeOrmFixture);
          });

          it('should return a model test', () => {
            expect(result).toStrictEqual(modelTest);
          });
        });
      });
    });
  });

  afterAll(async () => {
    await tearDownModelTestTable(queryRunner, modelTestTable);

    await datasource.destroy();
  });
});
