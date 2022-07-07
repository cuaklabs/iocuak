import { beforeAll, describe, expect, it } from '@jest/globals';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerSingletonServiceImplementation } from './ContainerSingletonServiceImplementation';

describe(ContainerSingletonServiceImplementation.name, () => {
  describe('.get', () => {
    describe('when called, and serviceIdToInstanceMap has no entries', () => {
      let containerSingletonServiceImplementation: ContainerSingletonServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerSingletonServiceImplementation =
          new ContainerSingletonServiceImplementation();

        result = containerSingletonServiceImplementation.get('service-id');
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and serviceIdToInstanceMap has an entry with the same service id', () => {
      let containerSingletonServiceImplementation: ContainerSingletonServiceImplementation;
      let valueFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        containerSingletonServiceImplementation =
          new ContainerSingletonServiceImplementation();

        const serviceKey: string = 'service-id';

        valueFixture = 'value';

        containerSingletonServiceImplementation.set(serviceKey, valueFixture);

        result = containerSingletonServiceImplementation.get(serviceKey);
      });

      it('should return the entry value', () => {
        expect(result).toBe(valueFixture);
      });
    });
  });

  describe('.remove', () => {
    describe('when called, with a value associated to the service id', () => {
      let serviceIdFixture: ServiceId;
      let containerSingletonServiceImplementation: ContainerSingletonServiceImplementation;

      beforeAll(() => {
        containerSingletonServiceImplementation =
          new ContainerSingletonServiceImplementation();

        serviceIdFixture = 'sample-service-id';
        const instanceFixture: unknown = 'sample-instance';

        containerSingletonServiceImplementation.set(
          serviceIdFixture,
          instanceFixture,
        );

        containerSingletonServiceImplementation.remove(serviceIdFixture);
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerSingletonServiceImplementation.get(serviceIdFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe('.set', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let instanceFixture: unknown;
      let containerSingletonServiceImplementation: ContainerSingletonServiceImplementation;

      beforeAll(() => {
        containerSingletonServiceImplementation =
          new ContainerSingletonServiceImplementation();

        serviceIdFixture = 'sample-service-id';
        instanceFixture = 'sample-instance';

        containerSingletonServiceImplementation.set(
          serviceIdFixture,
          instanceFixture,
        );
      });

      describe('when .get() is called with the same service id', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            containerSingletonServiceImplementation.get(serviceIdFixture);
        });

        it('should return an instance', () => {
          expect(result).toBe(instanceFixture);
        });
      });
    });
  });
});
