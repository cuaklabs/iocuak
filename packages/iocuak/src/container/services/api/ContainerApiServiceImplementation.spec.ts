jest.mock('../../../binding/utils/api/convertBindingToBindingApi');

import { BindingApi } from '../../../binding/models/api/BindingApi';
import { BindingApiType } from '../../../binding/models/api/BindingApiType';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { convertBindingToBindingApi } from '../../../binding/utils/api/convertBindingToBindingApi';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { ContainerModuleApi } from '../../modules/api/ContainerModuleApi';
import { ContainerBindingService } from '../domain/ContainerBindingService';
import { ContainerInstanceService } from '../domain/ContainerInstanceService';
import { ContainerMetadataService } from '../domain/ContainerMetadataService';
import { ContainerService } from '../domain/ContainerService';
import { ContainerApiServiceImplementation } from './ContainerApiServiceImplementation';

describe(ContainerApiServiceImplementation.name, () => {
  let containerServiceMock: jest.Mocked<ContainerService>;
  let containerApiServiceImplementation: ContainerApiServiceImplementation;

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
      } as Partial<ContainerMetadataService>,
    } as Partial<
      jest.Mocked<ContainerService>
    > as jest.Mocked<ContainerService>;

    containerApiServiceImplementation = new ContainerApiServiceImplementation(
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
          containerApiServiceImplementation.bind(typeFixture);
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
          scope: TaskScope.transient,
          type: typeFixture,
        };

        (
          containerServiceMock.metadata.getBindingMetadata as jest.Mock<
            TypeBinding | undefined
          >
        ).mockReturnValueOnce(bindingFixture);

        containerApiServiceImplementation.bind(typeFixture);
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

        containerApiServiceImplementation.bindToValue(
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

        result = containerApiServiceImplementation.get(serviceIdFixture);
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

        result = containerApiServiceImplementation.getAllBindinds();
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

        containerApiServiceImplementation.load(containerModuleApiMock);
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

        containerApiServiceImplementation.unbind(serviceIdFixture);
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
