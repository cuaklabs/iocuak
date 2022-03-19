import 'reflect-metadata';

import { ContainerApi, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { FindEntityPort } from '../../port/application/FindEntityPort';
import { ReadManyEntityInteractor } from '../domain/ReadManyEntityInteractor';
import { ReadOneEntityInteractor } from '../domain/ReadOneEntityInteractor';
import { DomainReadContainerModuleApi } from './DomainReadContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(DomainReadContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainReadContainerModuleApi: DomainReadContainerModuleApi<
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

    domainReadContainerModuleApi = new DomainReadContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no read adapter bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          domainReadContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with read many entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap.readManyEntityInteractor,
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
                  'No bindings found for type readEntityAdapter',
                ) as string,
              }),
            );
          });
        });

        describe('when containerApi.get is called with read one entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap.readOneEntityInteractor,
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
                  'No bindings found for type readEntityAdapter',
                ) as string,
              }),
            );
          });
        });
      });
    });

    describe('having a containerApi with read adapter bound', () => {
      @injectable({
        id: CrudModuleType.readEntityAdapter,
      })
      class FindAdapterMock implements FindEntityPort<ModelTest, QueryTest> {
        public readonly findMock: jest.Mock<Promise<ModelTest[]>, [QueryTest]>;
        public readonly findOneMock: jest.Mock<Promise<ModelTest>, [QueryTest]>;

        constructor() {
          this.findMock = jest.fn<Promise<ModelTest[]>, [QueryTest]>();
          this.findOneMock = jest.fn<Promise<ModelTest>, [QueryTest]>();
        }

        public async find(query: QueryTest): Promise<ModelTest[]> {
          return this.findMock(query);
        }

        public async findOne(query: QueryTest): Promise<ModelTest> {
          return this.findOneMock(query);
        }
      }

      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();

        containerApi.bind(FindAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainReadContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with read many entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap.readManyEntityInteractor,
            );
          });

          it('should return a ReadManyEntityInteractor', () => {
            expect(result).toBeInstanceOf(ReadManyEntityInteractor);
          });
        });

        describe('when containerApi.get is called with read one entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap.readOneEntityInteractor,
            );
          });

          it('should return a ReadOneEntityInteractor', () => {
            expect(result).toBeInstanceOf(ReadOneEntityInteractor);
          });
        });
      });
    });
  });
});
