import 'reflect-metadata';

import { Container, injectable, Newable } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';

import { DeleteTypeOrmAdapter } from '../../adapter/typeorm/DeleteTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmDeleteContainerModule } from './TypeOrmDeleteContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

describe(TypeOrmDeleteContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  let typeOrmDeleteContainerModule: TypeOrmDeleteContainerModule<
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

    typeOrmDeleteContainerModule = new TypeOrmDeleteContainerModule(
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
          typeOrmDeleteContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              containerApi.get(
                crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityAdapter],
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

    describe('having a containerApi with dependencies bound', () => {
      let containerApi: Container;

      beforeAll(() => {
        const findQueryToFindQueryTypeOrmConverterType: Newable = class {};
        injectable({
          id: crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
          ],
        })(findQueryToFindQueryTypeOrmConverterType);

        containerApi = Container.build();

        containerApi.bindToValue({
          serviceId:
            crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
          value: {},
        });
        containerApi.bind(findQueryToFindQueryTypeOrmConverterType);
      });

      describe('when called', () => {
        beforeAll(() => {
          typeOrmDeleteContainerModule.load(containerApi);
        });

        describe('when containerApi.get is called with delete entity adapter symbol', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(
              crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityAdapter],
            );
          });

          it('should return a DeleteTypeOrmAdapter', () => {
            expect(result).toBeInstanceOf(DeleteTypeOrmAdapter);
          });
        });
      });
    });
  });
});
