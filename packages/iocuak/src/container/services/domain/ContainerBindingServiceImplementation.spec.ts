import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { ContainerBindingService } from './ContainerBindingService';
import { ContainerBindingServiceImplementation } from './ContainerBindingServiceImplementation';

describe(ContainerBindingServiceImplementation.name, () => {
  describe('.get()', () => {
    describe('when called, and serviceIdToInstanceMap has no entries and parent is undefined', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has no entries', () => {
      let parent: jest.Mocked<ContainerBindingService>;
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        parent = {
          get: jest.fn().mockReturnValueOnce(undefined),
        } as Partial<
          jest.Mocked<ContainerBindingService>
        > as jest.Mocked<ContainerBindingService>;

        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has an entry with the same service id', () => {
      let parent: jest.Mocked<ContainerBindingService>;
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        const serviceIdFixture: ServiceId = 'service-id';

        bindingFixture = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: TaskScope.transient,
          type: class {},
        };

        parent = {
          get: jest.fn().mockReturnValueOnce(bindingFixture),
        } as Partial<
          jest.Mocked<ContainerBindingService>
        > as jest.Mocked<ContainerBindingService>;

        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get(serviceIdFixture);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        const serviceIdFixture: ServiceId = 'service-id';

        bindingFixture = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          serviceIdFixture,
          bindingFixture,
        );

        result = containerBindingServiceImplementation.get(serviceIdFixture);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });
  });

  describe('.getAll()', () => {
    describe('when called, and serviceIdToInstanceMap has an entry and parent is undefined', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          bindingFixture.id,
          bindingFixture,
        );

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([[bindingFixture.id, bindingFixture]]),
        );
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry and parent has an entry with different id', () => {
      let parentMock: jest.Mocked<ContainerBindingService>;
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          bindingType: BindingType.type,
          id: 'parent-service-id',
          scope: TaskScope.transient,
          type: class {},
        };

        parentMock = {
          getAll: jest
            .fn()
            .mockReturnValueOnce(
              new Map<ServiceId, Binding>([
                [parentBindingFixture.id, parentBindingFixture],
              ]),
            ),
        } as Partial<
          jest.Mocked<ContainerBindingService>
        > as jest.Mocked<ContainerBindingService>;

        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation(parentMock);

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          bindingFixture.id,
          bindingFixture,
        );

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([
            [bindingFixture.id, bindingFixture],
            [parentBindingFixture.id, parentBindingFixture],
          ]),
        );
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry and parent has an entry with same id', () => {
      let parentMock: jest.Mocked<ContainerBindingService>;
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: TaskScope.singleton,
          type: class {},
        };

        parentMock = {
          getAll: jest
            .fn()
            .mockReturnValueOnce(
              new Map<ServiceId, Binding>([
                [parentBindingFixture.id, parentBindingFixture],
              ]),
            ),
        } as Partial<
          jest.Mocked<ContainerBindingService>
        > as jest.Mocked<ContainerBindingService>;

        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation(parentMock);

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          bindingFixture.id,
          bindingFixture,
        );

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([[bindingFixture.id, bindingFixture]]),
        );
      });
    });
  });

  describe('.set()', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let bindingFixture: Binding;
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        serviceIdFixture = 'sample-service-id';
        bindingFixture = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          serviceIdFixture,
          bindingFixture,
        );
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(serviceIdFixture);
        });

        it('should return an instance', () => {
          expect(result).toBe(bindingFixture);
        });
      });
    });
  });

  describe('.remove()', () => {
    describe('when called, and serviceIdToInstanceMap has no entries', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let serviceIdFixture: ServiceId;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        serviceIdFixture = 'sample-service-id';

        containerBindingServiceImplementation.remove(serviceIdFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(serviceIdFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let serviceIdFixture: ServiceId;
      let bindingFixture: Binding;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        serviceIdFixture = 'sample-service-id';

        bindingFixture = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: TaskScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(
          serviceIdFixture,
          bindingFixture,
        );

        containerBindingServiceImplementation.remove(serviceIdFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(serviceIdFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
