import 'reflect-metadata';

import { ContainerApi, injectable } from '@cuaklabs/iocuak';

import { CreateAdapter } from '../../adapter/domain/CreateAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';
import { CreationContainerModuleApi } from './CreationContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(CreationContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let creationContainerModuleApi: CreationContainerModuleApi<
    ModelTest,
    QueryTest
  >;

  beforeAll(() => {
    crudModuleTypeToSymbolMap = Object.freeze({
      [CrudModuleType.createEntityAdapter]: Symbol(),
      [CrudModuleType.createEntityInteractor]: Symbol(),
      [CrudModuleType.deleteEntityAdapter]: Symbol(),
      [CrudModuleType.deleteEntityInteractor]: Symbol(),
      [CrudModuleType.readEntityAdapter]: Symbol(),
      [CrudModuleType.readManyEntityInteractor]: Symbol(),
      [CrudModuleType.readOneEntityInteractor]: Symbol(),
      [CrudModuleType.updateEntityAdapter]: Symbol(),
      [CrudModuleType.updateEntityInteractor]: Symbol(),
    });

    creationContainerModuleApi = new CreationContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no creation adapter bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          creationContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with create entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap.createEntityInteractor,
              );
            } catch (error: unknown) {
              result = error;
            }
          });

          it('should throw an Error', () => {
            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining<Partial<Error>>({
                message: expect.stringContaining(
                  'No bindings found for type createEntityAdapter',
                ) as string,
              }),
            );
          });
        });
      });
    });

    describe('having a containerApi with creation adapter bound', () => {
      @injectable({
        id: CrudModuleType.createEntityAdapter,
      })
      class CreateAdapterMock implements CreateAdapter<ModelTest, QueryTest> {
        public readonly insertOneMock: jest.Mock<
          Promise<ModelTest>,
          [QueryTest]
        >;

        constructor() {
          this.insertOneMock = jest.fn<Promise<ModelTest>, [QueryTest]>();
        }

        public async insertOne(query: QueryTest): Promise<ModelTest> {
          return this.insertOneMock(query);
        }
      }

      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();

        containerApi.bind(CreateAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          creationContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with create entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap.createEntityInteractor,
            );
          });

          it('should return a CreateEntityInteractor', () => {
            expect(result).toBeInstanceOf(CreateEntityInteractor);
          });
        });
      });
    });
  });
});
