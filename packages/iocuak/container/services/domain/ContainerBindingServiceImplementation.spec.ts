import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../task/models/domain/ServiceId';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { ContainerBindingServiceImplementation } from './ContainerBindingServiceImplementation';

describe(ContainerBindingServiceImplementation.name, () => {
  describe('.get()', () => {
    describe('when called, and serviceIdToInstanceMap has no entries', () => {
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

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerBindingServiceImplementation: ContainerBindingServiceImplementation;
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementation =
          new ContainerBindingServiceImplementation();

        const serviceIdFixture: ServiceId = 'service-id';

        bindingFixture = {
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
});
