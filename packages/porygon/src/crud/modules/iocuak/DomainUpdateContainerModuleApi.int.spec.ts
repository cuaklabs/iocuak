import 'reflect-metadata';

import { ContainerApi, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';
import { UpdateEntityInteractor } from '../domain/UpdateEntityInteractor';
import { DomainUpdateContainerModuleApi } from './DomainUpdateContainerModuleApi';

interface QueryTest {
  bar: string;
}

describe(DomainUpdateContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainUpdateContainerModuleApi: DomainUpdateContainerModuleApi<QueryTest>;

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

    domainUpdateContainerModuleApi = new DomainUpdateContainerModuleApi(
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
          domainUpdateContainerModuleApi.load(containerApi);
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
                  'No bindings found for type Symbol()',
                ) as string,
              }),
            );
          });
        });
      });
    });

    describe('having a containerApi with update adapter bound', () => {
      class UpdateAdapterMock implements UpdateEntityPort<QueryTest> {
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
        injectable({
          id: crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter],
        })(UpdateAdapterMock);

        containerApi = ContainerApi.build();

        containerApi.bind(UpdateAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainUpdateContainerModuleApi.load(containerApi);
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
