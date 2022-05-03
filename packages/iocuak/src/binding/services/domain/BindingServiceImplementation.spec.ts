import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Binding } from '../../models/domain/Binding';
import { BindingScope } from '../../models/domain/BindingScope';
import { BindingType } from '../../models/domain/BindingType';
import { BindingService } from './BindingService';
import { BindingServiceImplementation } from './BindingServiceImplementation';

describe(BindingServiceImplementation.name, () => {
  describe('.get()', () => {
    describe('when called, and serviceIdToInstanceMap has no entries and parent is undefined', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has no entries', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        parent = {
          get: jest.fn().mockReturnValueOnce(undefined),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has no entries and parent has an entry with the same service id', () => {
      let parent: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        const serviceIdFixture: ServiceId = 'service-id';

        bindingFixture = {
          bindingType: BindingType.type,
          id: serviceIdFixture,
          scope: BindingScope.transient,
          type: class {},
        };

        parent = {
          get: jest.fn().mockReturnValueOnce(bindingFixture),
        } as Partial<
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parent);

        result = containerBindingServiceImplementation.get(serviceIdFixture);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.get(bindingFixture.id);
      });

      it('should return the entry value', () => {
        expect(result).toBe(bindingFixture);
      });
    });
  });

  describe('.getAll()', () => {
    describe('when called, and serviceIdToInstanceMap has an entry and parent is undefined', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);

        result = containerBindingServiceImplementation.getAll();
      });

      it('should return a service to binding map', () => {
        expect(result).toStrictEqual(
          new Map<ServiceId, Binding>([[bindingFixture.id, bindingFixture]]),
        );
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry and parent has an entry with different id', () => {
      let parentMock: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          bindingType: BindingType.type,
          id: 'parent-service-id',
          scope: BindingScope.transient,
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
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parentMock);

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);

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
      let parentMock: jest.Mocked<BindingService>;
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let parentBindingFixture: Binding;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        parentBindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.singleton,
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
          jest.Mocked<BindingService>
        > as jest.Mocked<BindingService>;

        containerBindingServiceImplementation =
          new BindingServiceImplementation(parentMock);

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);

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
      let bindingFixture: Binding;
      let containerBindingServiceImplementation: BindingServiceImplementation;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'sample-service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(bindingFixture.id);
        });

        it('should return an instance', () => {
          expect(result).toBe(bindingFixture);
        });
      });
    });
  });

  describe('.remove()', () => {
    describe('when called, and serviceIdToInstanceMap has no entries', () => {
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let serviceIdFixture: ServiceId;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

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
      let containerBindingServiceImplementation: BindingServiceImplementation;
      let bindingFixture: Binding;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new BindingServiceImplementation();

        bindingFixture = {
          bindingType: BindingType.type,
          id: 'sample-service-id',
          scope: BindingScope.transient,
          type: class {},
        };

        containerBindingServiceImplementation.set(bindingFixture);

        containerBindingServiceImplementation.remove(bindingFixture.id);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerBindingServiceImplementation.get(bindingFixture.id);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
