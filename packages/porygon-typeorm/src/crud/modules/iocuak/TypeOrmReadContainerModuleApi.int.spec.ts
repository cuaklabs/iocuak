import 'reflect-metadata';

import { ContainerApi, injectable, Newable } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';

import { FindTypeOrmAdapter } from '../../adapter/typeorm/FindTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmReadContainerModuleApi } from './TypeOrmReadContainerModuleApi';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(TypeOrmReadContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  let typeOrmReadContainerModuleApi: TypeOrmReadContainerModuleApi<
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

    typeOrmReadContainerModuleApi = new TypeOrmReadContainerModuleApi(
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
          typeOrmReadContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with read entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter],
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

        const findQueryToFindQueryTypeOrmConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
          ],
        })(findQueryToFindQueryTypeOrmConverterType);

        containerApi = ContainerApi.build();

        containerApi.bindToValue(
          crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
          {},
        );
        containerApi.bind(modelDbToModelConverterType);
        containerApi.bind(findQueryToFindQueryTypeOrmConverterType);
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmReadContainerModuleApi.load(containerApi);
        });

        describe('when containerApi.get is called with read entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter],
            );
          });

          it('should return a FindTypeOrmAdapter', () => {
            expect(result).toBeInstanceOf(FindTypeOrmAdapter);
          });
        });
      });
    });
  });
});
