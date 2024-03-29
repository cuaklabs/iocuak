import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./lazyGetBindingOrThrow');

import { ServiceId } from '@cuaklabs/iocuak-common';

import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { TaskContextServices } from '../../createInstanceTask/models/TaskContextServices';
import { TypeBindingFixtures } from '../fixtures/TypeBindingFixtures';
import { ValueBindingFixtures } from '../fixtures/ValueBindingFixtures';
import { BindingService } from '../services/BindingService';
import { getBinding } from './getBinding';
import { lazyGetBindingOrThrow } from './lazyGetBindingOrThrow';

describe(getBinding.name, () => {
  let bindingServiceMock: jest.Mocked<BindingService>;
  let contextMock: CreateInstanceTaskContext;

  beforeAll(() => {
    bindingServiceMock = {
      get: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

    contextMock = {
      services: {
        bindingService: bindingServiceMock,
      } as Partial<TaskContextServices> as TaskContextServices,
    } as Partial<CreateInstanceTaskContext> as CreateInstanceTaskContext;
  });

  describe('when called, and context.services.bindingService.get() returns undefined', () => {
    let serviceIdFixture: ServiceId;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = Symbol();

      bindingServiceMock.get.mockReturnValueOnce(undefined);

      (
        lazyGetBindingOrThrow as jest.Mock<typeof lazyGetBindingOrThrow>
      ).mockReturnValueOnce(TypeBindingFixtures.any);

      result = getBinding(serviceIdFixture, contextMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.bindingService.get()', () => {
      expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
      expect(bindingServiceMock.get).toHaveBeenCalledWith(serviceIdFixture);
    });

    it('should call lazyGetBindingOrThrow()', () => {
      expect(lazyGetBindingOrThrow).toHaveBeenCalledTimes(1);
      expect(lazyGetBindingOrThrow).toHaveBeenCalledWith(serviceIdFixture);
    });

    it('should return a binding', () => {
      expect(result).toStrictEqual(TypeBindingFixtures.any);
    });
  });

  describe('when called, and context.services.bindingService.get() returns Binding', () => {
    let serviceIdFixture: ServiceId;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = Symbol();

      bindingServiceMock.get.mockReturnValueOnce(ValueBindingFixtures.any);

      result = getBinding(serviceIdFixture, contextMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.bindingService.get()', () => {
      expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
      expect(bindingServiceMock.get).toHaveBeenCalledWith(serviceIdFixture);
    });

    it('should not call lazyGetBindingOrThrow()', () => {
      expect(lazyGetBindingOrThrow).not.toHaveBeenCalled();
    });

    it('should return a binding', () => {
      expect(result).toStrictEqual(ValueBindingFixtures.any);
    });
  });
});
