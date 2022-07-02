import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('../../../binding/utils/domain/lazyGetBindingOrThrow');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { getBinding } from './getBinding';

describe(getBinding.name, () => {
  let bindingServiceMock: jestMock.Mocked<BindingService>;
  let metadataServiceFixture: MetadataService;
  let contextMock: TaskContext;

  beforeAll(() => {
    bindingServiceMock = {
      get: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;

    metadataServiceFixture = {
      _type: Symbol(),
    } as unknown as MetadataService;

    contextMock = {
      services: {
        bindingService: bindingServiceMock,
        metadataService: metadataServiceFixture,
      } as Partial<TaskContextServices> as TaskContextServices,
    } as Partial<TaskContext> as TaskContext;
  });

  describe('when called, and context.services.bindingService.get() returns undefined', () => {
    let serviceIdFixture: ServiceId;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = Symbol();

      bindingServiceMock.get.mockReturnValueOnce(undefined);

      (
        lazyGetBindingOrThrow as jestMock.Mock<typeof lazyGetBindingOrThrow>
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
      expect(lazyGetBindingOrThrow).toHaveBeenCalledWith(
        serviceIdFixture,
        metadataServiceFixture,
      );
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
