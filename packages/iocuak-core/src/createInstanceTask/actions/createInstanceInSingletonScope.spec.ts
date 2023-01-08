import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./createInstanceInTransientScope');

import { TypeBinding } from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../../binding/fixtures/TypeBindingFixtures';
import { ContainerSingletonService } from '../../container/services/ContainerSingletonService';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { TaskContextServices } from '../models/TaskContextServices';
import { createInstanceInSingletonScope } from './createInstanceInSingletonScope';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

describe(createInstanceInSingletonScope.name, () => {
  let typeBindingFixture: TypeBinding;
  let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
  let taskContextFixture: CreateInstanceTaskContext;

  beforeAll(() => {
    typeBindingFixture = TypeBindingFixtures.any;
    containerSingletonServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerSingletonService>
    > as jest.Mocked<ContainerSingletonService>;

    taskContextFixture = {
      requestId: Symbol(),
      services: {
        containerSingletonService: containerSingletonServiceMock,
      } as Partial<TaskContextServices> as TaskContextServices,
    } as Partial<CreateInstanceTaskContext> as CreateInstanceTaskContext;
  });

  describe('when called, and context.services.containerSingletonService.get() returns undefined', () => {
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      instanceFixture = Symbol();

      containerSingletonServiceMock.get.mockReturnValueOnce(undefined);

      (
        createInstanceInTransientScope as jest.Mock<
          typeof createInstanceInTransientScope
        >
      ).mockReturnValueOnce(instanceFixture);

      result = createInstanceInSingletonScope(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.containerSingletonService.get()', () => {
      expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
      expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should call createInstanceInTransientScope()', () => {
      expect(createInstanceInTransientScope).toHaveBeenCalledTimes(1);
      expect(createInstanceInTransientScope).toHaveBeenCalledWith(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    it('should call context.services.containerSingletonService.set()', () => {
      expect(containerSingletonServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
        typeBindingFixture.id,
        instanceFixture,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });

  describe('when called, and context.services.containerSingletonService.get() returns a service', () => {
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      instanceFixture = Symbol();

      containerSingletonServiceMock.get.mockReturnValueOnce(instanceFixture);

      result = createInstanceInSingletonScope(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.containerSingletonService.get()', () => {
      expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
      expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });
});
