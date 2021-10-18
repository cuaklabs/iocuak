import { ContainerSingletonServiceImplementation } from './ContainerSingletonServiceImplementation';

describe(ContainerSingletonServiceImplementation.name, () => {
  describe('.get()', () => {
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
});
