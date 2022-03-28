jest.mock('../../../metadata/utils/api/convertBindingToBindingApi');

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BindingApi } from '../../../metadata/models/api/BindingApi';
import { BindingApiType } from '../../../metadata/models/api/BindingApiType';
import { Binding } from '../../../metadata/models/domain/Binding';
import { BindingScope } from '../../../metadata/models/domain/BindingScope';
import { BindingType } from '../../../metadata/models/domain/BindingType';
import { TypeBinding } from '../../../metadata/models/domain/TypeBinding';
import { ValueBinding } from '../../../metadata/models/domain/ValueBinding';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { convertBindingToBindingApi } from '../../../metadata/utils/api/convertBindingToBindingApi';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
import { ContainerBindingService } from '../domain/ContainerBindingService';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerService } from '../domain/ContainerService';
import { ContainerServiceApiImplementation } from './ContainerServiceApiImplementation';

describe(ContainerServiceApiImplementation.name, () => {
  let containerServiceMock: jest.Mocked<ContainerService>;
  let containerServiceApiImplementation: ContainerServiceApiImplementation;

  beforeAll(() => {
    containerServiceMock = {
      binding: {
        getAll: jest.fn(),
        remove: jest.fn(),
        set: jest.fn(),
      } as Partial<ContainerBindingService>,
      instance: {
        create: jest.fn(),
      } as Partial<ContainerInstanceService>,
      metadata: {
        getBindingMetadata: jest.fn(),
      } as Partial<MetadataService>,
    } as Partial<
      jest.Mocked<ContainerService>
    > as jest.Mocked<ContainerService>;

    containerServiceApiImplementation = new ContainerServiceApiImplementation(
      containerServiceMock,
    );
  });

  describe('.bind', () => {
    describe('when called, and containerService.metadata.getBindingMetadata returns undefined', () => {
      let typeFixture: Newable;
      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};

        (
          containerServiceMock.metadata.getBindingMetadata as jest.Mock<
            TypeBinding | undefined
          >
        ).mockReturnValueOnce(undefined);

        try {
          containerServiceApiImplementation.bind(typeFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'No bindings found for type',
            ) as string,
          }),
        );
      });
    });

    describe('when called, and containerService.metadata.getBindingMetadata returns a type binding', () => {
      let typeFixture: Newable;
      let bindingFixture: TypeBinding;

      beforeAll(() => {
        typeFixture = class {};

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'sample-service-id',
          scope: BindingScope.transient,
          type: typeFixture,
        };

        (
          containerServiceMock.metadata.getBindingMetadata as jest.Mock<
            TypeBinding | undefined
          >
        ).mockReturnValueOnce(bindingFixture);

        containerServiceApiImplementation.bind(typeFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerService.binding.set()', () => {
        expect(containerServiceMock.binding.set).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.binding.set).toHaveBeenCalledWith(
          bindingFixture,
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

      it('should call containerService.binding.set()', () => {
        const expectedValueBinding: ValueBinding = {
          bindingType: BindingType.value,
          id: serviceIdFixture,
          value: instanceFixture,
        };

        expect(containerServiceMock.binding.set).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.binding.set).toHaveBeenCalledWith(
          expectedValueBinding,
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

        (containerServiceMock.instance.create as jest.Mock).mockReturnValueOnce(
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
          bindingType: BindingApiType.value,
          id: bindingFixture.id,
          value: bindingFixture.value,
        };

        (
          containerServiceMock.binding.getAll as jest.Mock<
            Map<ServiceId, Binding>,
            []
          >
        ).mockReturnValueOnce(new Map([[bindingFixture.id, bindingFixture]]));

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

      it('should call containerService.binding.remove()', () => {
        expect(containerServiceMock.binding.remove).toHaveBeenCalledTimes(1);
        expect(containerServiceMock.binding.remove).toHaveBeenCalledWith(
          serviceIdFixture,
        );
      });
    });
  });
});
