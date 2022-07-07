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
import { DeleteEntityInteractor } from '../domain/DeleteEntityInteractor';
import { DomainDeleteContainerModule } from './DomainDeleteContainerModule';

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
      // eslint-disable-next-line @typescript-eslint/ban-types
      let injectableDecoratorMock: jestMock.Mock<ClassDecorator> &
        ClassDecorator;

      beforeAll(() => {
        injectDecoratorMock = jest.fn();

        (inject as jestMock.Mock<typeof inject>).mockReturnValueOnce(
          injectDecoratorMock,
        );

        // eslint-disable-next-line @typescript-eslint/ban-types
        injectableDecoratorMock = jest.fn() as jestMock.Mock<ClassDecorator> &
          ClassDecorator;

        (injectable as jestMock.Mock<typeof injectable>).mockReturnValueOnce(
          injectableDecoratorMock,
        );

        domainDeleteContainerModule.load(containerModuleBindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call injectable()', () => {
        expect(injectable).toHaveBeenCalledTimes(1);
        expect(injectableDecoratorMock).toHaveBeenCalledTimes(1);

        expect(injectable).toHaveBeenCalledWith({
          id: crudModuleTypeToSymbolMap.deleteEntityInteractor,
          scope: BindingScope.singleton,
        });

        expect(injectableDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(DeleteEntityInteractor),
        );
      });

      it('should call inject()', () => {
        expect(inject).toHaveBeenCalledTimes(1);
        expect(injectDecoratorMock).toHaveBeenCalledTimes(1);

        expect(inject).toHaveBeenCalledWith(
          crudModuleTypeToSymbolMap[CrudModuleType.deleteEntityAdapter],
        );

        expect(injectDecoratorMock).toHaveBeenCalledWith(
          expectClassExtending(DeleteEntityInteractor),
          undefined,
          0,
        );
      });

      it('should call containerApi.bind()', () => {
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledTimes(1);
        expect(containerModuleBindingServiceMock.bind).toHaveBeenCalledWith(
          expectClassExtending(DeleteEntityInteractor),
        );
      });
    });
  });
});
