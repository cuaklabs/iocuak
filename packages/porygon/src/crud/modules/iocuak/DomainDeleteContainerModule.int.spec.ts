import 'reflect-metadata';

import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { Container, injectable } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { DeleteEntityPort } from '../../port/application/DeleteEntityPort';
import { DeleteEntityInteractor } from '../domain/DeleteEntityInteractor';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';

interface QueryTest {
  bar: string;
}

describe(DomainDeleteContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainDeleteContainerModule: DomainDeleteContainerModule<QueryTest>;

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

    domainDeleteContainerModule = new DomainDeleteContainerModule(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    describe('having a containerApi with no delete adapter bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        containerApi = Container.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          domainDeleteContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[
                  CrudModuleType.deleteEntityInteractor
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

    describe('having a containerApi with delete adapter bound', () => {
      class DeleteAdapterMock implements DeleteEntityPort<QueryTest> {
        public readonly deleteMock: jestMock.Mock<
          (query: QueryTest) => Promise<void>
        >;

        constructor() {
          this.deleteMock = jest.fn();
        }

        public async delete(query: QueryTest): Promise<void> {
          return this.deleteMock(query);
        }
      }

      let containerApi: Container;

      beforeAll(() => {
        injectable({
          id: crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityAdapter],
        })(DeleteAdapterMock);

        containerApi = Container.build();

        containerApi.bind(DeleteAdapterMock);
      });

      describe('when called', () => {
        beforeAll(() => {
          domainDeleteContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity interactor symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityInteractor],
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
