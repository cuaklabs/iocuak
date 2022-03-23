import 'reflect-metadata';

import { ContainerApi, injectable, Newable } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';

import { InsertTypeOrmAdapter } from '../../adapter/typeorm/InsertTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmCreateContainerModuleApi } from './TypeOrmCreateContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(TypeOrmCreateContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  let typeOrmCreateContainerModuleApi: TypeOrmCreateContainerModuleApi<
    ModelTest,
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

    typeOrmCreateContainerModuleApi = new TypeOrmCreateContainerModuleApi(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
  });

  describe('.load', () => {
    describe('having a containerApi with no dependencies bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        containerApi = ContainerApi.build();
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmCreateContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with create entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter],
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

    describe('having a containerApi with dependencies bound', () => {
      let containerApi: ContainerApi;

      beforeAll(() => {
        const modelDbToModelConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.modelDbToModelConverter
          ],
        })(modelDbToModelConverterType);

        const insertQueryToSetTypeOrmQueryConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.insertQueryToSetTypeOrmQueryConverter
          ],
        })(insertQueryToSetTypeOrmQueryConverterType);

        containerApi = ContainerApi.build();

        containerApi.bindToValue(
          crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
          {},
        );
        containerApi.bind(modelDbToModelConverterType);
        containerApi.bind(insertQueryToSetTypeOrmQueryConverterType);
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmCreateContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with create entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter],
            );
          });

          it('should return a InsertTypeOrmAdapter', () => {
            expect(result).toBeInstanceOf(InsertTypeOrmAdapter);
          });
        });
      });
    });
  });
});
