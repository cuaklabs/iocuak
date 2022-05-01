jest.mock(
  '../../../containerModuleTask/utils/api/convertToContainerModuleMetadata',
);
jest.mock('../../utils/bind');
jest.mock('../../utils/bindToValue');
jest.mock('../../../metadata/utils/api/convertBindingToBindingApi');

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleMetadataApi } from '../../../containerModuleTask/models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadata } from '../../../containerModuleTask/models/domain/ContainerModuleMetadata';
import { convertToContainerModuleMetadata } from '../../../containerModuleTask/utils/api/convertToContainerModuleMetadata';
import { BindingApi } from '../../../metadata/models/api/BindingApi';
import { BindingTypeApi } from '../../../metadata/models/api/BindingTypeApi';
import { Binding } from '../../../metadata/models/domain/Binding';
import { BindingType } from '../../../metadata/models/domain/BindingType';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { convertBindingToBindingApi } from '../../../metadata/utils/api/convertBindingToBindingApi';
import { bind } from '../../utils/bind';
import { bindToValue } from '../../utils/bindToValue';
import { ContainerBindingService } from '../domain/ContainerBindingService';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerModuleService } from '../domain/ContainerModuleService';
import { ContainerService } from '../domain/ContainerService';
import { ContainerSingletonService } from '../domain/ContainerSingletonService';
import { ContainerServiceApiImplementation } from './ContainerServiceApiImplementation';

describe(ContainerServiceApiImplementation.name, () => {
  let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
  let containerInstanceServiceMock: jest.Mocked<ContainerInstanceService>;
  let containerModuleServiceMock: jest.Mocked<ContainerModuleService>;
  let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;
  let containerServiceMock: ContainerService;
  let containerServiceApiImplementation: ContainerServiceApiImplementation;

  beforeAll(() => {
    containerBindingServiceMock = {
      getAll: jest.fn(),
      remove: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerBindingService>
    > as jest.Mocked<ContainerBindingService>;
    containerInstanceServiceMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerInstanceService>
    > as jest.Mocked<ContainerInstanceService>;
    containerModuleServiceMock = {
      loadMetadata: jest.fn(),
    };
    containerSingletonServiceMock = {
      remove: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerSingletonService>
    > as jest.Mocked<ContainerSingletonService>;
    metadataServiceMock = {
      getBindingMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;

    containerServiceMock = {
      binding: containerBindingServiceMock,
      instance: containerInstanceServiceMock,
      metadata: metadataServiceMock,
      module: containerModuleServiceMock,
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
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let instanceFixture: unknown;

      beforeAll(() => {
        serviceIdFixture = 'service-id';
        instanceFixture = {
          foo: 'bar',
        };

        containerServiceApiImplementation.bindToValue(
          serviceIdFixture,
          instanceFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bindToValue()', () => {
        expect(bindToValue).toHaveBeenCalledTimes(1);
        expect(bindToValue).toHaveBeenCalledWith(
          serviceIdFixture,
          instanceFixture,
          containerServiceMock.binding,
        );
      });
    });
  });

  describe('.get', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let instanceFixture: unknown;
      let result: unknown;

      beforeAll(() => {
        serviceIdFixture = 'service-id';
        instanceFixture = {
          foo: 'bar',
        };

        containerInstanceServiceMock.create.mockReturnValueOnce(
          instanceFixture,
        );

        result = containerServiceApiImplementation.get(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerService.instance.create()', () => {
        expect(containerServiceMock.instance.create).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.instance.create).toHaveBeenCalledWith(
          serviceIdFixture,
        );
      });

      it('should return an instance', () => {
        expect(result).toBe(instanceFixture);
      });
    });
  });

  describe('.getAll', () => {
    describe('when called', () => {
      let bindingFixture: Binding;
      let bindingApiFixture: BindingApi;
      let result: unknown;

      beforeAll(() => {
        bindingFixture = {
          bindingType: BindingType.value,
          id: 'service-id',
          value: {},
        };

        bindingApiFixture = {
          bindingType: BindingTypeApi.value,
          id: bindingFixture.id,
          value: bindingFixture.value,
        };

        containerBindingServiceMock.getAll.mockReturnValueOnce(
          new Map([[bindingFixture.id, bindingFixture]]),
        );

        (
          convertBindingToBindingApi as jest.Mock<BindingApi, [Binding]>
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

      beforeAll(async () => {
        containerModuleMetadataApiFixture = {
          _tag: Symbol('ContainerModuleMetadataApi'),
        } as unknown as ContainerModuleMetadataApi;

        containerModuleMetadataFixture = {
          _tag: Symbol('ContainerModule'),
        } as unknown as ContainerModuleMetadata;

        (
          convertToContainerModuleMetadata as jest.Mock<ContainerModuleMetadata>
        ).mockReturnValueOnce(containerModuleMetadataFixture);

        await containerServiceApiImplementation.loadMetadata(
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

      it('should call containerService.module.loadMetadata()', () => {
        expect(containerModuleServiceMock.loadMetadata).toHaveBeenCalledTimes(
          1,
        );
        expect(containerModuleServiceMock.loadMetadata).toHaveBeenCalledWith(
          containerModuleMetadataFixture,
        );
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
