import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-core');

jest.mock('../../../binding/utils/api/convertBindingToBindingApi');
jest.mock(
  '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata',
);
jest.mock('../../../binding/utils/api/convertToBindOptions');
jest.mock('../../../binding/utils/domain/bind');
jest.mock('../../../binding/utils/domain/bindToValue');

import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import {
  BindingService,
  ContainerRequestService,
  ContainerSingletonService,
  createInstancesByTag,
  createInstance,
  createInstanceFromBinding,
  getDependencies,
  loadContainerModule,
  TaskContext,
  ContainerModuleMetadata,
} from '@cuaklabs/iocuak-core';
import { Binding, BindOptions } from '@cuaklabs/iocuak-models';
import {
  BindingApi,
  BindingTypeApi,
  BindOptionsApi,
} from '@cuaklabs/iocuak-models-api';

import { BindOptionsApiFixtures } from '../../../binding/fixtures/api/BindOptionsApiFixtures';
import { BindOptionsFixtures } from '../../../binding/fixtures/domain/BindOptionsFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { convertToBindOptions } from '../../../binding/utils/api/convertToBindOptions';
import { bind } from '../../../binding/utils/domain/bind';
import { bindToValue } from '../../../binding/utils/domain/bindToValue';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { convertToContainerModuleMetadata } from '../../../containerModuleMetadata/actions/api/convertToContainerModuleMetadata';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { ContainerService } from '../domain/ContainerService';
import { ContainerServiceApiImplementation } from './ContainerServiceApiImplementation';

describe(ContainerServiceApiImplementation.name, () => {
  let containerBindingServiceMock: jest.Mocked<BindingService>;
  let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
  let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
  let containerServiceMock: ContainerService;
  let containerServiceApiImplementation: ContainerServiceApiImplementation;

  beforeAll(() => {
    containerBindingServiceMock = {
      getAll: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
    containerRequestServiceMock = {
      end: jest.fn(),
      start: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerRequestService>
    > as jest.Mocked<ContainerRequestService>;
    containerSingletonServiceMock = {
      remove: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerSingletonService>
    > as jest.Mocked<ContainerSingletonService>;

    containerServiceMock = {
      binding: containerBindingServiceMock,
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
      let bindOptionsApiFixture: BindOptionsApi;
      let bindOptionsFixture: BindOptions;

      beforeAll(() => {
        typeFixture = class {};
        bindOptionsApiFixture = BindOptionsApiFixtures.any;
        bindOptionsFixture = BindOptionsFixtures.any;

        (
          convertToBindOptions as jest.Mock<typeof convertToBindOptions>
        ).mockReturnValueOnce(bindOptionsFixture);

        containerServiceApiImplementation.bind(
          typeFixture,
          bindOptionsApiFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call convertToBindOptions()', () => {
        expect(convertToBindOptions).toHaveBeenCalledTimes(1);
        expect(convertToBindOptions).toHaveBeenCalledWith(
          bindOptionsApiFixture,
        );
      });

      it('should call bind()', () => {
        expect(bind).toHaveBeenCalledTimes(1);
        expect(bind).toHaveBeenCalledWith(
          typeFixture,
          bindOptionsFixture,
          containerServiceMock.binding,
        );
      });
    });
  });

  describe('.bindToValue', () => {
    describe('having a tag array', () => {
      let tagsFixture: Tag[];

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
      let tagsFixture: Tag;

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
          createInstance as jest.Mock<typeof createInstance>
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
      let tagFixture: Tag;

      let instancesFixture: unknown[];
      let requestIdFixture: symbol;

      let result: unknown;

      beforeAll(() => {
        tagFixture = 'tag-id';

        instancesFixture = [
          {
            foo: 'bar',
          },
        ];
        requestIdFixture = Symbol();

        containerRequestServiceMock.start.mockReturnValueOnce(requestIdFixture);

        (
          createInstancesByTag as jest.Mock<typeof createInstancesByTag>
        ).mockReturnValueOnce(instancesFixture);

        result = containerServiceApiImplementation.getByTag(tagFixture);
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
          },
          servicesInstantiatedSet: new Set(),
        };

        expect(createInstancesByTag).toHaveBeenCalledTimes(1);
        expect(createInstancesByTag).toHaveBeenCalledWith(
          tagFixture,
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
          convertBindingToBindingApi as jest.Mock<
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
      let containerModuleApiMock: jest.Mocked<ContainerModuleApi>;

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
          convertToContainerModuleMetadata as jest.Mock<
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
