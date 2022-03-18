import 'reflect-metadata';

import { ContainerApi, injectable } from '@cuaklabs/iocuak';

import { DeleteAdapter } from '../../adapter/domain/DeleteAdapter';
import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DeleteEntityInteractor } from '../domain/DeleteEntityInteractor';
import { DeleteContainerModuleApi } from './DeleteContainerModuleApi';

interface QueryTest {
  bar: string;
}

describe(DeleteContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let deleteContainerModuleApi: DeleteContainerModuleApi<QueryTest>;

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

    deleteContainerModuleApi = new DeleteContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no delete adapter bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          deleteContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap.deleteEntityInteractor,
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
                  'No bindings found for type deleteEntityAdapter',
                ) as string,
              }),
            );
          });
        });
      });
    });

    describe('having a containerApi with delete adapter bound', () => {
      @injectable({
        id: CrudModuleType.deleteEntityAdapter,
      })
      class DeleteAdapterMock implements DeleteAdapter<QueryTest> {
        public readonly deleteMock: jest.Mock<Promise<void>, [QueryTest]>;

        constructor() {
          this.deleteMock = jest.fn<Promise<void>, [QueryTest]>();
        }

        public async delete(query: QueryTest): Promise<void> {
          return this.deleteMock(query);
        }
      }

      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();

        containerApi.bind(DeleteAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          deleteContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap.deleteEntityInteractor,
            );
          });

          it('should return a DeleteEntityInteractor', () => {
            expect(result).toBeInstanceOf(DeleteEntityInteractor);
          });
        });
      });
    });
  });
});
