import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../../binding/utils/api/convertBindingToBindingApi');
jest.mock(
  '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata',
);
jest.mock('../../../task/actions/domain/createInstance');
jest.mock('../../../task/actions/domain/createInstancesByTag');
jest.mock('../../../task/actions/domain/loadContainerModule');
jest.mock('../../utils/bind');
jest.mock('../../utils/bindToValue');

import { Newable, ServiceId } from '@cuaklabs/iocuak-common';

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingApi } from '../../../binding/models/api/BindingApi';
import { BindingTypeApi } from '../../../binding/models/api/BindingTypeApi';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModuleMetadata } from '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { createInstance } from '../../../task/actions/domain/createInstance';
import { createInstanceFromBinding } from '../../../task/actions/domain/createInstanceFromBinding';
import { createInstancesByTag } from '../../../task/actions/domain/createInstancesByTag';
import { getDependencies } from '../../../task/actions/domain/getDependencies';
import { loadContainerModule } from '../../../task/actions/domain/loadContainerModule';
import { TaskContext } from '../../../task/models/domain/TaskContext';
import { bind } from '../../utils/bind';
import { bindToValue } from '../../utils/bindToValue';
import { ContainerRequestService } from '../domain/ContainerRequestService';
import { ContainerService } from '../domain/ContainerService';
import { ContainerSingletonService } from '../domain/ContainerSingletonService';
import { ContainerServiceApiImplementation } from './ContainerServiceApiImplementation';

describe(ContainerServiceApiImplementation.name, () => {
  let containerBindingServiceMock: jestMock.Mocked<BindingService>;
  let containerRequestServiceMock: jestMock.Mocked<ContainerRequestService>;
  let containerSingletonServiceMock: jestMock.Mocked<ContainerSingletonService>;
  let metadataServiceMock: jestMock.Mocked<MetadataService>;
  let containerServiceMock: ContainerService;
  let containerServiceApiImplementation: ContainerServiceApiImplementation;

  beforeAll(() => {
    containerBindingServiceMock = {
      getAll: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;
    containerRequestServiceMock = {
      end: jest.fn(),
      start: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerRequestService>
    > as jestMock.Mocked<ContainerRequestService>;
    containerSingletonServiceMock = {
      remove: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerSingletonService>
    > as jestMock.Mocked<ContainerSingletonService>;
    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<
      jestMock.Mocked<MetadataService>
    > as jestMock.Mocked<MetadataService>;

    containerServiceMock = {
      binding: containerBindingServiceMock,
      metadata: metadataServiceMock,
      request: containerRequestServiceMock,
      singleton: containerSingletonServiceMock,
    } as Partial<ContainerService> as ContainerService;

    containerServiceApiImplementation = new ContainerServiceApiImplementation(
      containerServiceMock,
    );
  });

  describe('.bind', () => {
    describe('when called', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};

        containerServiceApiImplementation.bind(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bind()', () => {
        expect(bind).toHaveBeenCalledTimes(1);
        expect(bind).toHaveBeenCalledWith(
          typeFixture,
          containerServiceMock.binding,
          containerServiceMock.metadata,
        );
      });
    });
  });

  describe('.bindToValue', () => {
    describe('having a tag array', () => {
      let tagsFixture: BindingTag[];

      beforeAll(() => {
        tagsFixture = [Symbol()];
      });

      describe('when called', () => {
        let serviceIdFixture: ServiceId;
        let instanceFixture: unknown;

        beforeAll(() => {
          serviceIdFixture = 'service-id';
          instanceFixture = {
            foo: 'bar',
          };

          containerServiceApiImplementation.bindToValue({
            serviceId: serviceIdFixture,
            tags: tagsFixture,
            value: instanceFixture,
          });
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindToValue()', () => {
          expect(bindToValue).toHaveBeenCalledTimes(1);
          expect(bindToValue).toHaveBeenCalledWith(
            serviceIdFixture,
            tagsFixture,
            instanceFixture,
            containerServiceMock.binding,
          );
        });
      });
    });

    describe('having a tag symbol', () => {
      let tagsFixture: BindingTag;

      beforeAll(() => {
        tagsFixture = Symbol();
      });

      describe('when called', () => {
        let serviceIdFixture: ServiceId;
        let instanceFixture: unknown;

        beforeAll(() => {
          serviceIdFixture = 'service-id';
          instanceFixture = {
            foo: 'bar',
          };

          containerServiceApiImplementation.bindToValue({
            serviceId: serviceIdFixture,
            tags: tagsFixture,
            value: instanceFixture,
          });
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindToValue()', () => {
          expect(bindToValue).toHaveBeenCalledTimes(1);
          expect(bindToValue).toHaveBeenCalledWith(
            serviceIdFixture,
            [tagsFixture],
            instanceFixture,
            containerServiceMock.binding,
          );
        });
      });
    });

    describe('having no tags', () => {
      describe('when called', () => {
        let serviceIdFixture: ServiceId;
        let instanceFixture: unknown;

        beforeAll(() => {
          serviceIdFixture = 'service-id';
          instanceFixture = {
            foo: 'bar',
          };

          containerServiceApiImplementation.bindToValue({
            serviceId: serviceIdFixture,
            value: instanceFixture,
          });
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindToValue()', () => {
          expect(bindToValue).toHaveBeenCalledTimes(1);
          expect(bindToValue).toHaveBeenCalledWith(
            serviceIdFixture,
            [],
            instanceFixture,
            containerServiceMock.binding,
          );
        });
      });
    });
  });

  describe('.get', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;

      let instanceFixture: unknown;
      let requestIdFixture: symbol;

      let result: unknown;

      beforeAll(() => {
        serviceIdFixture = 'service-id';

        instanceFixture = {
          foo: 'bar',
        };
        requestIdFixture = Symbol();

        containerRequestServiceMock.start.mockReturnValueOnce(requestIdFixture);

        (
          createInstance as jestMock.Mock<typeof createInstance>
        ).mockReturnValueOnce(instanceFixture);

        result = containerServiceApiImplementation.get(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstance()', () => {
        const expectedTaskContext: TaskContext = {
          actions: {
            createInstanceFromBinding,
            getDependencies,
          },
          requestId: requestIdFixture,
          services: {
            bindingService: containerBindingServiceMock,
            containerRequestService: containerRequestServiceMock,
            containerSingletonService: containerSingletonServiceMock,
            metadataService: metadataServiceMock,
          },
          servicesInstantiatedSet: new Set(),
        };

        expect(createInstance).toHaveBeenCalledTimes(1);
        expect(createInstance).toHaveBeenCalledWith(
          serviceIdFixture,
          expectedTaskContext,
        );
      });

      it('should return an instance', () => {
        expect(result).toBe(instanceFixture);
      });
    });
  });

  describe('.getByTag', () => {
    describe('when called', () => {
      let bindingTagFixture: BindingTag;

      let instancesFixture: unknown[];
      let requestIdFixture: symbol;

      let result: unknown;

      beforeAll(() => {
        bindingTagFixture = 'tag-id';

        instancesFixture = [
          {
            foo: 'bar',
          },
        ];
        requestIdFixture = Symbol();

        containerRequestServiceMock.start.mockReturnValueOnce(requestIdFixture);

        (
          createInstancesByTag as jestMock.Mock<typeof createInstancesByTag>
        ).mockReturnValueOnce(instancesFixture);

        result = containerServiceApiImplementation.getByTag(bindingTagFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstancesByTag()', () => {
        const expectedTaskContext: TaskContext = {
          actions: {
            createInstanceFromBinding,
            getDependencies,
          },
          requestId: requestIdFixture,
          services: {
            bindingService: containerBindingServiceMock,
            containerRequestService: containerRequestServiceMock,
            containerSingletonService: containerSingletonServiceMock,
            metadataService: metadataServiceMock,
          },
          servicesInstantiatedSet: new Set(),
        };

        expect(createInstancesByTag).toHaveBeenCalledTimes(1);
        expect(createInstancesByTag).toHaveBeenCalledWith(
          bindingTagFixture,
          expectedTaskContext,
        );
      });

      it('should return an instance', () => {
        expect(result).toBe(instancesFixture);
      });
    });
  });

  describe('.getAllBindinds', () => {
    describe('when called', () => {
      let bindingFixture: Binding;
      let bindingApiFixture: BindingApi;
      let result: unknown;

      beforeAll(() => {
        bindingFixture = ValueBindingFixtures.any;

        bindingApiFixture = {
          bindingType: BindingTypeApi.value,
          id: bindingFixture.id,
          tags: [...bindingFixture.tags],
          value: bindingFixture.value,
        };

        containerBindingServiceMock.getAll.mockReturnValueOnce(
          new Map([[bindingFixture.id, bindingFixture]]),
        );

        (
          convertBindingToBindingApi as jestMock.Mock<
            typeof convertBindingToBindingApi
          >
        ).mockReturnValueOnce(bindingApiFixture);

        result = containerServiceApiImplementation.getAllBindinds();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerServiceMock.binding.getAll()', () => {
        expect(containerServiceMock.binding.getAll).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.binding.getAll).toHaveBeenCalledWith();
      });

      it('should call convertBindingToBindingApi()', () => {
        expect(convertBindingToBindingApi).toHaveBeenCalledTimes(1);
        expect(convertBindingToBindingApi).toHaveBeenCalledWith(bindingFixture);
      });

      it('should return bindings', () => {
        expect(result).toStrictEqual([bindingApiFixture]);
      });
    });
  });

  describe('.load', () => {
    describe('when called', () => {
      let containerModuleApiMock: jestMock.Mocked<ContainerModuleApi>;

      beforeAll(() => {
        containerModuleApiMock = {
          load: jest.fn(),
        };

        containerServiceApiImplementation.load(containerModuleApiMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuleApi.load()', () => {
        expect(containerModuleApiMock.load).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('.loadMetadata', () => {
    describe('when called', () => {
      let containerModuleMetadataApiFixture: ContainerModuleMetadataApi;
      let containerModuleMetadataFixture: ContainerModuleMetadata;
      let requestIdFixture: symbol;

      let result: unknown;

      beforeAll(async () => {
        containerModuleMetadataApiFixture = {
          _tag: Symbol('ContainerModuleMetadataApi'),
        } as unknown as ContainerModuleMetadataApi;

        containerModuleMetadataFixture = {
          _tag: Symbol('ContainerModule'),
        } as unknown as ContainerModuleMetadata;
        requestIdFixture = Symbol();

        containerRequestServiceMock.start.mockReturnValueOnce(requestIdFixture);

        (
          convertToContainerModuleMetadata as jestMock.Mock<
            typeof convertToContainerModuleMetadata
          >
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        result = await containerServiceApiImplementation.loadMetadata(
          containerModuleMetadataApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call convertToContainerModuleMetadata()', () => {
        expect(convertToContainerModuleMetadata).toHaveBeenCalledTimes(1);
        expect(convertToContainerModuleMetadata).toHaveBeenCalledWith(
          containerModuleMetadataApiFixture,
        );
      });

      it('should call loadContainerModule()', () => {
        const expectedTaskContext: TaskContext = {
          actions: {
            createInstanceFromBinding,
            getDependencies,
          },
          requestId: requestIdFixture,
          services: {
            bindingService: containerBindingServiceMock,
            containerRequestService: containerRequestServiceMock,
            containerSingletonService: containerSingletonServiceMock,
            metadataService: metadataServiceMock,
          },
          servicesInstantiatedSet: new Set(),
        };

        expect(loadContainerModule).toHaveBeenCalledTimes(1);
        expect(loadContainerModule).toHaveBeenCalledWith(
          containerModuleMetadataFixture,
          expectedTaskContext,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unbind', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;

      beforeAll(() => {
        serviceIdFixture = 'service-id';

        containerServiceApiImplementation.unbind(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call unbind containerService.singleton.remove()', () => {
        expect(containerServiceMock.singleton.remove).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.singleton.remove).toHaveBeenCalledWith(
          serviceIdFixture,
        );
      });

      it('should call containerService.binding.remove()', () => {
        expect(containerServiceMock.binding.remove).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.binding.remove).toHaveBeenCalledWith(
          serviceIdFixture,
        );
      });
    });
  });
});
