import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../createInstanceTask/actions/createInstance');

import { BindingService } from '../../binding/services/BindingService';
import { ContainerModuleClassMetadata } from '../../containerModuleMetadata/models/ContainerModuleClassMetadata';
import { createInstance } from '../../createInstanceTask/actions/createInstance';
import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { TaskContextServices } from '../../createInstanceTask/models/TaskContextServices';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';

describe(loadFromContainerModuleClassMetadata.name, () => {
  let containerModuleClassMetadataMock: ContainerModuleClassMetadata;
  let taskContextMock: LoadModuleMetadataTaskContext;

  beforeAll(() => {
    containerModuleClassMetadataMock = {
      loader: jest.fn(),
      moduleType: jest.fn(),
    } as Partial<ContainerModuleClassMetadata> as ContainerModuleClassMetadata;

    taskContextMock = {
      createInstanceTaskContext: {
        services: {
          bindingService: {
            [Symbol()]: Symbol(),
          } as unknown as BindingService,
        } as Partial<TaskContextServices> as TaskContextServices,
      } as Partial<CreateInstanceTaskContext> as CreateInstanceTaskContext,
    } as Partial<LoadModuleMetadataTaskContext> as LoadModuleMetadataTaskContext;
  });

  describe('when called', () => {
    let containerModuleInstanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      containerModuleInstanceFixture = Symbol();

      (createInstance as jest.Mock<typeof createInstance>).mockReturnValueOnce(
        containerModuleInstanceFixture,
      );

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
        taskContextMock.createInstanceTaskContext,
      );
    });

    it('should call containerModuleClassMetadata.loader()', () => {
      expect(containerModuleClassMetadataMock.loader).toHaveBeenCalledTimes(1);
      expect(containerModuleClassMetadataMock.loader).toHaveBeenCalledWith(
        containerModuleInstanceFixture,
        taskContextMock.createInstanceTaskContext.services.bindingService,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
