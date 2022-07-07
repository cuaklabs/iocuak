import 'reflect-metadata';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { Container, injectable, Newable } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';

import { UpdateTypeOrmAdapter } from '../../adapter/typeorm/UpdateTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmUpdateContainerModule } from './TypeOrmUpdateContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(TypeOrmUpdateContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  let typeOrmUpdateContainerModule: TypeOrmUpdateContainerModule<
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

    crudTypeOrmModuleTypeToSymbolMap = Object.freeze({
      [CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter]: Symbol(),
      [CrudTypeOrmModuleType.insertQueryToSetTypeOrmQueryConverter]: Symbol(),
      [CrudTypeOrmModuleType.modelDbToModelConverter]: Symbol(),
      [CrudTypeOrmModuleType.repository]: Symbol(),
      [CrudTypeOrmModuleType.updateQueryToFindQueryTypeOrmConverter]: Symbol(),
      [CrudTypeOrmModuleType.updateQueryToSetQueryTypeOrmConverter]: Symbol(),
    });

    typeOrmUpdateContainerModule = new TypeOrmUpdateContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
  });

  describe('.load', () => {
    describe('having a containerApi with no dependencies bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        containerApi = Container.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmUpdateContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with update entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter],
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

    describe('having a containerApi with dependencies bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        const updateQueryToFindQueryTypeOrmConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.updateQueryToFindQueryTypeOrmConverter
          ],
        })(updateQueryToFindQueryTypeOrmConverterType);

        const updateQueryToSetQueryTypeOrmQueryConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.updateQueryToSetQueryTypeOrmConverter
          ],
        })(updateQueryToSetQueryTypeOrmQueryConverterType);

        containerApi = Container.build();

        containerApi.bindToValue({
          serviceId:
            crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
          value: {},
        });
        containerApi.bind(updateQueryToFindQueryTypeOrmConverterType);
        containerApi.bind(updateQueryToSetQueryTypeOrmQueryConverterType);
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmUpdateContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with update entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.updateEntityAdapter],
            );
          });

          it('should return a UpdateTypeOrmAdapter', () => {
            expect(result).toBeInstanceOf(UpdateTypeOrmAdapter);
          });
        });
      });
    });
  });
});
