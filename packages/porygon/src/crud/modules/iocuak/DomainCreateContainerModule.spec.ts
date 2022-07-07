import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak');

import {
  inject,
  injectable,
  BindingScope,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';

import { CrudModuleType } from '../../models/domain/CrudModuleType';
import { ModuleTypeToSymbolMap } from '../../models/domain/ModuleTypeToSymbolMap';
import { CreateEntityInteractor } from '../domain/CreateEntityInteractor';
import { DomainCreateContainerModule } from './DomainCreateContainerModule';

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

describe(DomainCreateContainerModule.name, () => {
  let crudModuleTypeToSymbolMap: ModuleTypeToSymbolMap<CrudModuleType>;
  let domainCreationContainerModule: DomainCreateContainerModule<
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

    domainCreationContainerModule = new DomainCreateContainerModule(
      crudModuleTypeToSymbolMap,
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

        (inject as jestMock.Mock<typeof inject>).mockReturnValueOnce(
          injectDecoratorMock,
        );

        injectableDecoratorMock = jest.fn() as jestMock.Mock<ClassDecorator> &
          ClassDecorator;

        (injectable as jestMock.Mock<typeof injectable>).mockReturnValueOnce(
          injectableDecoratorMock,
        );

        domainCreationContainerModule.load(containerModuleBindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call injectable()', () => {
        expect(injectable).toHaveBeenCalledTimes(1);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(1);

        expect(injectable).toHaveBeenCalledWith({
          id: crudModuleTypeToSymbolMap.createEntityInteractor,
          scope: BindingScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(CreateEntityInteractor),
        );
      });

      it('should call inject()', () => {
        expect(inject).toHaveBeenCalledTimes(1);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(1);

        expect(inject).toHaveBeenCalledWith(
          crudModuleTypeToSymbolMap[CrudModuleType.createEntityAdapter],
        );

        expect(injectDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(CreateEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledTimes(1);
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledWith(
          expectClassExtending(CreateEntityInteractor),
        );
      });
    });
  });
});
