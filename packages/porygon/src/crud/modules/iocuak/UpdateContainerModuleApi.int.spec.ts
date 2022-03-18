import 'reflect-metadata';

import { ContainerApi, injectable } from '@cuaklabs/iocuak';

import { UpdateAdapter } from '../../adapter/domain/UpdateAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { UpdateEntityInteractor } from '../domain/UpdateEntityInteractor';
import { UpdateContainerModuleApi } from './UpdateContainerModuleApi';

interface QueryTest {
  bar: string;
}

describe(UpdateContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let updateContainerModuleApi: UpdateContainerModuleApi<QueryTest>;

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

    updateContainerModuleApi = new UpdateContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no update adapter bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          updateContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with update entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap.updateEntityInteractor,
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
                  'No bindings found for type updateEntityAdapter',
                ) as string,
              }),
            );
          });
        });
      });
    });

    describe('having a containerApi with update adapter bound', () => {
      @injectable({
        id: CrudModuleType.updateEntityAdapter,
      })
      class UpdateAdapterMock implements UpdateAdapter<QueryTest> {
        public readonly updateMock: jest.Mock<Promise<void>, [QueryTest]>;

        constructor() {
          this.updateMock = jest.fn<Promise<void>, [QueryTest]>();
        }

        public async update(query: QueryTest): Promise<void> {
          return this.updateMock(query);
        }
      }

      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();

        containerApi.bind(UpdateAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          updateContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with update entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap.updateEntityInteractor,
            );
          });

          it('should return a UpdateEntityInteractor', () => {
            expect(result).toBeInstanceOf(UpdateEntityInteractor);
          });
        });
      });
    });
  });
});
