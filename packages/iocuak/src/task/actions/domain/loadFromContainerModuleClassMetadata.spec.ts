import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./createInstance');

import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerModuleClassMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleClassMetadata';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { createInstance } from './createInstance';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';

describe(loadFromContainerModuleClassMetadata.name, () => {
  let containerModuleClassMetadataMock: ContainerModuleClassMetadata;
  let taskContextMock: TaskContext;

  beforeAll(() => {
    containerModuleClassMetadataMock = {
      loader: jest.fn(),
      moduleType: jest.fn(),
    } as Partial<ContainerModuleClassMetadata> as ContainerModuleClassMetadata;

    taskContextMock = {
      services: {
        bindingService: { [Symbol()]: Symbol() } as unknown as BindingService,
        metadataService: { [Symbol()]: Symbol() } as unknown as MetadataService,
      } as Partial<TaskContextServices> as TaskContextServices,
    } as Partial<TaskContext> as TaskContext;
  });

  describe('when called', () => {
    let containerModuleInstanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      containerModuleInstanceFixture = Symbol();

      (
        createInstance as jestMock.Mock<typeof createInstance>
      ).mockReturnValueOnce(containerModuleInstanceFixture);

      result = loadFromContainerModuleClassMetadata(
        containerModuleClassMetadataMock,
        taskContextMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call createInstance()', () => {
      expect(createInstance).toHaveBeenCalledTimes(1);
      expect(createInstance).toHaveBeenCalledWith(
        containerModuleClassMetadataMock.moduleType,
        taskContextMock,
      );
    });

    it('should call containerModuleClassMetadata.loader()', () => {
      expect(containerModuleClassMetadataMock.loader).toHaveBeenCalledTimes(1);
      expect(containerModuleClassMetadataMock.loader).toHaveBeenCalledWith(
        containerModuleInstanceFixture,
        taskContextMock.services.bindingService,
        taskContextMock.services.metadataService,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
