import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak');

import {
  inject,
  injectable,
  BindingScope,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';
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

// eslint-disable-next-line @typescript-eslint/ban-types
function expectClassExtending(superclass: Function): Function {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return expect.objectContaining({
    // eslint-disable-next-line @typescript-eslint/ban-types
    prototype: expect.any(superclass) as unknown as Function,
    // eslint-disable-next-line @typescript-eslint/ban-types
  }) as unknown as Function;
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

  describe('.load()', () => {
    let containerModuleBindingServiceMock: jestMock.Mocked<ContainerModuleBindingService>;

    beforeAll(() => {
      containerModuleBindingServiceMock = {
        bind: jest.fn(),
      } as Partial<
        jestMock.Mocked<ContainerModuleBindingService>
      > as jestMock.Mocked<ContainerModuleBindingService>;
    });

    describe('when called', () => {
      let injectDecoratorMock: jestMock.Mock<
        ParameterDecorator & PropertyDecorator
      >;
      let injectableDecoratorMock: jestMock.Mock<ClassDecorator> &
        ClassDecorator;

      beforeAll(() => {
        injectDecoratorMock = jest.fn();

        (inject as jestMock.Mock<typeof inject>)
          .mockReturnValueOnce(injectDecoratorMock)
          .mockReturnValueOnce(injectDecoratorMock);

        injectableDecoratorMock = jest.fn() as jestMock.Mock<ClassDecorator> &
          ClassDecorator;

        (injectable as jestMock.Mock<typeof injectable>).mockReturnValueOnce(
          injectableDecoratorMock,
        );

        typeOrmDeleteContainerModule.load(containerModuleBindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call injectable()', () => {
        expect(injectable).toHaveBeenCalledTimes(1);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(1);

        expect(injectable).toHaveBeenCalledWith({
          id: crudModuleTypeToSymbolMap.deleteEntityAdapter,
          scope: BindingScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(DeleteTypeOrmAdapter),
        );
      });

      it('should call inject()', () => {
        expect(inject).toHaveBeenCalledTimes(2);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(2);
      });

      it('should call inject() on DeleteTypeOrmAdapter in the first call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          1,
          crudTypeOrmModuleTypeToSymbolMap[CrudTypeOrmModuleType.repository],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(DeleteTypeOrmAdapter),
          undefined,
          0,
        );
      });

      it('should call inject() on DeleteTypeOrmAdapter in the second call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          2,
          crudTypeOrmModuleTypeToSymbolMap[
            CrudTypeOrmModuleType.findQueryToFindQueryTypeOrmConverter
          ],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(DeleteTypeOrmAdapter),
          undefined,
          1,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledTimes(1);
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledWith(
          expectClassExtending(DeleteTypeOrmAdapter),
        );
      });
    });
  });
});
