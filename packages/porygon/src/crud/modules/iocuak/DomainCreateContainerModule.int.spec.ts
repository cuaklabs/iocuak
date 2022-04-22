import 'reflect-metadata';

import { Container, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreateEntityPort } from '../../port/application/CreateEntityPort';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(DomainCreateContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainCreationContainerModule: DomainCreateContainerModule<
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

    domainCreationContainerModule = new DomainCreateContainerModule(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no create adapter bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        containerApi = Container.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          domainCreationContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with create entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[
                  CrudModuleType.createEntityInteractor
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

    describe('having a containerApi with creation adapter bound', () => {
      class CreateAdapterMock
        implements CreateEntityPort<ModelTest, QueryTest>
      {
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

      let containerApi: Container;

      beforeAll(() => {
        injectable({
          id: crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter],
        })(CreateAdapterMock);

        containerApi = Container.build();

        containerApi.bind(CreateAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainCreationContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with create entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.createEntityInteractor],
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
