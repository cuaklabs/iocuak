jest.mock('@cuaklabs/iocuak');

import { ContainerApi, inject, injectable, TaskScope } from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { ReadManyEntityInteractor } from '../domain/ReadManyEntityInteractor';
import { ReadOneEntityInteractor } from '../domain/ReadOneEntityInteractor';
import { ReadContainerModuleApi } from './ReadContainerModuleApi';

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

describe(ReadContainerModuleApi.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let readContainerModuleApi: ReadContainerModuleApi<ModelTest, QueryTest>;

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

    readContainerModuleApi = new ReadContainerModuleApi(
      crudModuleTypeToSymbolMap,
    );
  });

  describe('.load()', () => {
    let containerApiMock: jest.Mocked<ContainerApi>;

    beforeAll(() => {
      containerApiMock = {
        bind: jest.fn(),
      } as Partial<jest.Mocked<ContainerApi>> as jest.Mocked<ContainerApi>;
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

        readContainerModuleApi.load(containerApiMock);
      });

      it('should call @injectable() twice', () => {
        expect(injectable).toHaveBeenCalledTimes(2);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(2);
      });

      it('should call @injectable() on ReadOneInteractor in the first call', () => {
        expect(injectable).toHaveBeenNthCalledWith(1, {
          id: crudModuleTypeToSymbolMap.readOneEntityInteractor,
          scope: TaskScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
        );
      });

      it('should call @injectable() on ReadManyInteractor in the second call', () => {
        expect(injectable).toHaveBeenNthCalledWith(2, {
          id: crudModuleTypeToSymbolMap.readManyEntityInteractor,
          scope: TaskScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
        );
      });

      it('should call @inject() twice', () => {
        expect(inject).toHaveBeenCalledTimes(2);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(2);
      });

      it('should call @inject() on ReadOneInteractor in the first call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          1,
          CrudModuleType.readEntityAdapter,
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call @inject() on ReadManyInteractor in the second call', () => {
        expect(inject).toHaveBeenNthCalledWith(
          2,
          CrudModuleType.readEntityAdapter,
        );

        expect(injectDecoratorMock).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerApiMock.bind).toHaveBeenCalledTimes(2);
        expect(containerApiMock.bind).toHaveBeenNthCalledWith(
          1,
          expectClassExtending(ReadOneEntityInteractor),
        );
        expect(containerApiMock.bind).toHaveBeenNthCalledWith(
          2,
          expectClassExtending(ReadManyEntityInteractor),
        );
      });
    });
  });
});
