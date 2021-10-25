import { Binding } from '../../../binding/models/domain/Binding';
import { Newable } from '../../../task/models/domain/Newable';
import { ServiceId } from '../../../task/models/domain/ServiceId';
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

  describe('.bind()', () => {
    describe('when called, and containerService.metadata.getBindingMetadata returns undefined', () => {
      let typeFixture: Newable;
      let result: unknown;

      beforeAll(() => {
        typeFixture = class {};

        (
          containerServiceMock.metadata.getBindingMetadata as jest.Mock<
            Binding | undefined
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

    describe('when called, and containerService.metadata.getBindingMetadata returns a binding', () => {
      let typeFixture: Newable;
      let bindingFixture: Binding;

      beforeAll(() => {
        typeFixture = class {};

        bindingFixture = {
          id: 'sample-service-id',
          scope: TaskScope.transient,
          type: typeFixture,
        };

        (
          containerServiceMock.metadata.getBindingMetadata as jest.Mock<
            Binding | undefined
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
          bindingFixture.id,
          bindingFixture,
        );
      });
    });
  });

  describe('.get()', () => {
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

  describe('.load()', () => {
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

  describe('.unbind()', () => {
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
