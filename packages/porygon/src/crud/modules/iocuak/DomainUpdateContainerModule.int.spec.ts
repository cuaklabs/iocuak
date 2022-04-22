import 'reflect-metadata';

import { Container, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { UpdateEntityPort } from '../../port/application/UpdateEntityPort';
import { UpdateEntityInteractor } from '../domain/UpdateEntityInteractor';
import { DomainUpdateContainerModule } from './DomainUpdateContainerModule';

interface QueryTest {
  bar: string;
}

describe(DomainUpdateContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainUpdateContainerModule: DomainUpdateContainerModule<QueryTest>;

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

    domainUpdateContainerModule = new DomainUpdateContainerModule(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no update adapter bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        containerApi = Container.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          domainUpdateContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with update entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[
                  CrudModuleType.updateEntityInteractor
                ],
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
                  'No registered bindings found for type',
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

      let containerApi: Container;

      beforeAll(() => {
        injectable({
          id: crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter],
        })(UpdateAdapterMock);

        containerApi = Container.build();

        containerApi.bind(UpdateAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainUpdateContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with update entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.updateEntityInteractor],
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
