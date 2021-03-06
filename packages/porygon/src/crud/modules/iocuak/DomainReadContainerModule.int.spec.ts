import 'reflect-metadata';

import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { Container, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { FindEntityPort } from '../../port/application/FindEntityPort';
import { ReadManyEntityInteractor } from '../domain/ReadManyEntityInteractor';
import { ReadOneEntityInteractor } from '../domain/ReadOneEntityInteractor';
import { DomainReadContainerModule } from './DomainReadContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(DomainReadContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainReadContainerModule: DomainReadContainerModule<
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

    domainReadContainerModule = new DomainReadContainerModule(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no read adapter bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        containerApi = Container.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          domainReadContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with read many entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[
                  CrudModuleType.readManyEntityInteractor
                ],
              );
            } catch (error: unknown) {
              result = error;
            }
          });

          it('should throw an Error', () => {
            const expectedError: Partial<Error> = {
              message: expect.stringContaining(
                'No registered bindings found for type',
              ) as unknown as string,
            };

            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedError),
            );
          });
        });

        describe('when containerApi.get is called with read one entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[
                  CrudModuleType.readOneEntityInteractor
                ],
              );
            } catch (error: unknown) {
              result = error;
            }
          });

          it('should throw an Error', () => {
            const expectedError: Partial<Error> = {
              message: expect.stringContaining(
                'No registered bindings found for type',
              ) as unknown as string,
            };

            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedError),
            );
          });
        });
      });
    });

    describe('having a containerApi with read adapter bound', () => {
      class FindAdapterMock implements FindEntityPort<ModelTest, QueryTest> {
        public readonly findMock: jestMock.Mock<
          (query: QueryTest) => Promise<ModelTest[]>
        >;
        public readonly findOneMock: jestMock.Mock<
          (query: QueryTest) => Promise<ModelTest>
        >;

        constructor() {
          this.findMock = jest.fn();
          this.findOneMock = jest.fn();
        }

        public async find(query: QueryTest): Promise<ModelTest[]> {
          return this.findMock(query);
        }

        public async findOne(query: QueryTest): Promise<ModelTest> {
          return this.findOneMock(query);
        }
      }

      let containerApi: Container;

      beforeAll(() => {
        injectable({
          id: crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter],
        })(FindAdapterMock);

        containerApi = Container.build();

        containerApi.bind(FindAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainReadContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with read many entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[
                CrudModuleType.readManyEntityInteractor
              ],
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
              crudModuleTypeToSymbolMap[CrudModuleType.readOneEntityInteractor],
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
