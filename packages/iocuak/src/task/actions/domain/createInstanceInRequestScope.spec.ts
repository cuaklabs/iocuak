import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('./createInstanceInTransientScope');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { createInstanceInRequestScope } from './createInstanceInRequestScope';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

describe(createInstanceInRequestScope.name, () => {
  let typeBindingFixture: TypeBinding;
  let containerRequestServiceMock: jestMock.Mocked<ContainerRequestService>;
  let taskContextFixture: TaskContext;

  beforeAll(() => {
    typeBindingFixture = TypeBindingFixtures.any;
    containerRequestServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerRequestService>
    > as jestMock.Mocked<ContainerRequestService>;

    taskContextFixture = {
      requestId: Symbol(),
      services: {
        containerRequestService: containerRequestServiceMock,
      } as Partial<TaskContextServices> as TaskContextServices,
    } as Partial<TaskContext> as TaskContext;
  });

  describe('when called, and context.services.containerRequestService.get() returns undefined', () => {
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      instanceFixture = Symbol();

      containerRequestServiceMock.get.mockReturnValueOnce(undefined);

      (
        createInstanceInTransientScope as jestMock.Mock<
          typeof createInstanceInTransientScope
        >
      ).mockReturnValueOnce(instanceFixture);

      result = createInstanceInRequestScope(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.containerRequestService.get()', () => {
      expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
      expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
        taskContextFixture.requestId,
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

    it('should call context.services.containerRequestService.set()', () => {
      expect(containerRequestServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerRequestServiceMock.set).toHaveBeenCalledWith(
        taskContextFixture.requestId,
        typeBindingFixture.id,
        instanceFixture,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });

  describe('when called, and context.services.containerRequestService.get() returns a service', () => {
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      instanceFixture = Symbol();

      containerRequestServiceMock.get.mockReturnValueOnce(instanceFixture);

      result = createInstanceInRequestScope(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.containerRequestService.get()', () => {
      expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
      expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
        taskContextFixture.requestId,
        typeBindingFixture.id,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });
});
