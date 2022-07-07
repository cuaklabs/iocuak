import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./createInstance');

import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleFactoryMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleMetadataType } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadataType';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { createInstance } from './createInstance';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

describe(loadFromContainerModuleFactoryMetadata.name, () => {
  describe('having a ContainerModuleFactoryMetadata with an async factory', () => {
    let containerModuleFactoryMetadataFactoryMock: jestMock.Mock<
      () => Promise<ContainerModule>
    >;
    let containerModuleFactoryMetadataMock: ContainerModuleFactoryMetadata;

    beforeAll(() => {
      containerModuleFactoryMetadataFactoryMock =
        jest.fn<() => Promise<ContainerModule>>();

      containerModuleFactoryMetadataMock = {
        factory: containerModuleFactoryMetadataFactoryMock,
        imports: [],
        injects: [Symbol()],
        type: ContainerModuleMetadataType.factory,
      };
    });

    describe('when called', () => {
      let taskContextMock: TaskContext;
      let containerModuleMock: jestMock.Mocked<ContainerModule>;
      let factoryParameterFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        taskContextMock = {
          services: {
            bindingService: {
              [Symbol()]: Symbol(),
            } as unknown as BindingService,
            metadataService: {
              [Symbol()]: Symbol(),
            } as unknown as MetadataService,
          } as Partial<TaskContextServices> as TaskContextServices,
        } as Partial<TaskContext> as TaskContext;

        containerModuleMock = {
          load: jest.fn(),
        };

        factoryParameterFixture = Symbol();

        (
          createInstance as jestMock.Mock<typeof createInstance>
        ).mockReturnValueOnce(factoryParameterFixture);

        containerModuleFactoryMetadataFactoryMock.mockResolvedValueOnce(
          containerModuleMock,
        );

        result = await loadFromContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataMock,
          taskContextMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstance()', () => {
        const expectedTaskContext: TaskContext = {
          ...taskContextMock,
          servicesInstantiatedSet: new Set(),
        };

        expect(createInstance).toHaveBeenCalledTimes(1);
        expect(createInstance).toHaveBeenCalledWith(
          containerModuleFactoryMetadataMock.injects[0],
          expectedTaskContext,
        );
      });

      it('should call containerModuleFactoryMetadata.factory()', () => {
        expect(
          containerModuleFactoryMetadataMock.factory,
        ).toHaveBeenCalledTimes(1);
        expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledWith(
          factoryParameterFixture,
        );
      });

      it('should call containerModule.load()', () => {
        expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleMock.load).toHaveBeenCalledWith(
          taskContextMock.services.bindingService,
          taskContextMock.services.metadataService,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a ContainerModuleFactoryMetadata with a sync factory', () => {
    let containerModuleFactoryMetadataFactoryMock: jestMock.Mock<
      () => ContainerModule
    >;
    let containerModuleFactoryMetadataMock: ContainerModuleFactoryMetadata;

    beforeAll(() => {
      containerModuleFactoryMetadataFactoryMock =
        jest.fn<() => ContainerModule>();

      containerModuleFactoryMetadataMock = {
        factory: containerModuleFactoryMetadataFactoryMock,
        imports: [],
        injects: [Symbol()],
        type: ContainerModuleMetadataType.factory,
      };
    });

    describe('when called', () => {
      let taskContextMock: TaskContext;
      let containerModuleMock: jestMock.Mocked<ContainerModule>;
      let factoryParameterFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        taskContextMock = {
          services: {
            bindingService: {
              [Symbol()]: Symbol(),
            } as unknown as BindingService,
            metadataService: {
              [Symbol()]: Symbol(),
            } as unknown as MetadataService,
          } as Partial<TaskContextServices> as TaskContextServices,
        } as Partial<TaskContext> as TaskContext;

        containerModuleMock = {
          load: jest.fn(),
        };

        factoryParameterFixture = Symbol();

        (
          createInstance as jestMock.Mock<typeof createInstance>
        ).mockReturnValueOnce(factoryParameterFixture);

        containerModuleFactoryMetadataFactoryMock.mockReturnValueOnce(
          containerModuleMock,
        );

        result = await loadFromContainerModuleFactoryMetadata(
          containerModuleFactoryMetadataMock,
          taskContextMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstance()', () => {
        const expectedTaskContext: TaskContext = {
          ...taskContextMock,
          servicesInstantiatedSet: new Set(),
        };

        expect(createInstance).toHaveBeenCalledTimes(1);
        expect(createInstance).toHaveBeenCalledWith(
          containerModuleFactoryMetadataMock.injects[0],
          expectedTaskContext,
        );
      });

      it('should call containerModuleFactoryMetadata.factory()', () => {
        expect(
          containerModuleFactoryMetadataMock.factory,
        ).toHaveBeenCalledTimes(1);
        expect(containerModuleFactoryMetadataMock.factory).toHaveBeenCalledWith(
          factoryParameterFixture,
        );
      });

      it('should call containerModule.load()', () => {
        expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleMock.load).toHaveBeenCalledWith(
          taskContextMock.services.bindingService,
          taskContextMock.services.metadataService,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
