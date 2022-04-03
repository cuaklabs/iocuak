jest.mock('@cuaklabs/iocuak');

import {
  inject,
  injectable,
  BindingScope,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { ReadManyEntityInteractor } from '../domain/ReadManyEntityInteractor';
import { ReadOneEntityInteractor } from '../domain/ReadOneEntityInteractor';
import { DomainReadContainerModule } from './DomainReadContainerModule';

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
    let containerModuleBindingServiceMock: jest.Mocked<ContainerModuleBindingService>;

    beforeAll(() => {
      containerModuleBindingServiceMock = {
        bind: jest.fn(),
      } as Partial<
        jest.Mocked<ContainerModuleBindingService>
      > as jest.Mocked<ContainerModuleBindingService>;
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
          .mockReturnValueOnce(injectDecoratorMock);

        // eslint-disable-next-line @typescript-eslint/ban-types
        injectableDecoratorMock = jest.fn<void, [Function]>();

        (injectable as jest.Mock<ClassDecorator>)
          .mockReturnValueOnce(injectableDecoratorMock)
          .mockReturnValueOnce(injectableDecoratorMock);

        domainReadContainerModule.load(containerModuleBindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call @injectable() twice', () => {
        expect(injectable).toHaveBeenCalledTimes(2);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(2);
      });

      it('should call @injectable() on ReadOneInteractor in the first call', () => {
        expect(injectable).toHaveBeenNthCalledWith(1, {
          id: crudModuleTypeToSymbolMap.readOneEntityInteractor,
          scope: BindingScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
        );
      });

      it('should call @injectable() on ReadManyInteractor in the second call', () => {
        expect(injectable).toHaveBeenNthCalledWith(2, {
          id: crudModuleTypeToSymbolMap.readManyEntityInteractor,
          scope: BindingScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
        );
      });

      it('should call inject() twice', () => {
        expect(inject).toHaveBeenCalledTimes(2);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(2);
      });

      it('should call inject() on ReadOneInteractor in the first call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          1,
          crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call inject() on ReadManyInteractor in the second call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          2,
          crudModuleTypeToSymbolMap[CrudModuleType.readEntityAdapter],
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledTimes(2);
        expect(containerModuleBindingServiceMock.bind).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
        );
        expect(containerModuleBindingServiceMock.bind).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
        );
      });
    });
  });
});
