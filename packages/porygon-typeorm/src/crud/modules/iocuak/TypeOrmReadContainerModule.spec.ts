jest.mock('@cuaklabs/iocuak');

import { Container, inject, injectable, TaskScope } from '@cuaklabs/iocuak';
import { CrudModuleType, ModuleTypeToSymbolMap } from '@cuaklabs/porygon';

import { FindTypeOrmAdapter } from '../../adapter/typeorm/FindTypeOrmAdapter';
import { CrudTypeOrmModuleType } from '../../models/domain/CrudTypeOrmModuleType';
import { TypeOrmReadContainerModule } from './TypeOrmReadContainerModule';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  bar: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function expectClassExtending(superclass: Function): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return expect.objectContaining<Partial<Function>>({
    // eslint-disable-next-line @typescript-eslint/ban-types
    prototype: expect.any(superclass) as Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
  }) as Function;
}

describe(TypeOrmReadContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let crudTypeOrmModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudTypeOrmModuleType>;
  let typeOrmReadContainerModule: TypeOrmReadContainerModule<
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

    typeOrmReadContainerModule = new TypeOrmReadContainerModule(
      crudModuleTypeToSymbolMap,
      crudTypeOrmModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    let containerApiMock: jest.Mocked<Container>;

    beforeAll(() => {
      containerApiMock = {
        bind: jest.fn(),
      } as Partial<jest.Mocked<Container>> as jest.Mocked<Container>;
    });

    describe('when called', () => {
      let injectDecoratorMock: jest.Mock<
        void,
        // eslint-disable-next-line @typescript-eslint/ban-types
        [Object, string | symbol, number | void]
      >;
      // eslint-disable-next-line @typescript-eslint/ban-types
      let injectableDecoratorMock: jest.Mock<void, [Function]>;

      beforeAll(() => {
        injectDecoratorMock = jest.fn<
          void,
          // eslint-disable-next-line @typescript-eslint/ban-types
          [Object, string | symbol, number | void]
        >();

        (inject as jest.Mock<PropertyDecorator & ParameterDecorator>)
          .mockReturnValueOnce(injectDecoratorMock)
          .mockReturnValueOnce(injectDecoratorMock)
          .mockReturnValueOnce(injectDecoratorMock);

        // eslint-disable-next-line @typescript-eslint/ban-types
        injectableDecoratorMock = jest.fn<void, [Function]>();

        (injectable as jest.Mock<ClassDecorator>).mockReturnValueOnce(
          injectableDecoratorMock,
        );

        typeOrmReadContainerModule.load(containerApiMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call injectable()', () => {
        expect(injectable).toHaveBeenCalledTimes(1);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(1);

        expect(injectable).toHaveBeenCalledWith({
          id: crudModuleTypeToSymbolMap.readEntityAdapter,
          scope: TaskScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(FindTypeOrmAdapter),
        );
      });

      it('should call inject()', () => {
        expect(inject).toHaveBeenCalledTimes(3);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(3);
      });

      it('should call inject() on FindTypeOrmAdapter in the first call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          1,
          crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(FindTypeOrmAdapter),
          undefined,
          0,
        );
      });

      it('should call inject() on FindTypeOrmAdapter in the second call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          2,
          crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.modelDbToModelConverter
          ],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(FindTypeOrmAdapter),
          undefined,
          1,
        );
      });

      it('should call inject() on FindTypeOrmAdapter in the third call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          3,
          crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
          ],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          3,
          expectClassExtending(FindTypeOrmAdapter),
          undefined,
          2,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerApiMock.bind).toHaveBeenCalledTimes(1);
        expect(containerApiMock.bind).toHaveBeenCalledWith(
          expectClassExtending(FindTypeOrmAdapter),
        );
      });
    });
  });
});
