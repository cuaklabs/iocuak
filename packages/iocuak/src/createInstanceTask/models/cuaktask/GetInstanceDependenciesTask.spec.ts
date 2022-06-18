import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { ServiceDependencies } from '../domain/ServiceDependencies';
import { GetInstanceDependenciesTask } from './GetInstanceDependenciesTask';

describe(GetInstanceDependenciesTask.name, () => {
  describe('.perform()', () => {
    describe('when called, and dependencies do not match metadata', () => {
      let getInstanceDependenciesTask: GetInstanceDependenciesTask;

      let result: unknown;

      beforeAll(() => {
        getInstanceDependenciesTask = new GetInstanceDependenciesTask(
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndProperties,
        );

        try {
          getInstanceDependenciesTask.perform();
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'Invalid dependencies for service',
            ) as string,
          }),
        );
      });
    });

    describe('when called, and dependencies match metadata', () => {
      let getInstanceDependenciesTask: GetInstanceDependenciesTask;

      let constructorArgumentFixure: unknown;
      let propertyArgumentFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        getInstanceDependenciesTask = new GetInstanceDependenciesTask(
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndProperties,
        );

        constructorArgumentFixure = 'constructor argument';
        propertyArgumentFixture = 'property';

        result = getInstanceDependenciesTask.perform(
          [constructorArgumentFixure],
          propertyArgumentFixture,
        );
      });

      it('should return ServiceDependencies', () => {
        const [expectedPropertyKey]: [string] = [
          ...GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndProperties.metadata.properties.keys(),
        ] as [string];

        const expected: ServiceDependencies<unknown[]> = {
          constructorArguments: [constructorArgumentFixure],
          properties: new Map([[expectedPropertyKey, propertyArgumentFixture]]),
        };

        expect(result).toStrictEqual(expected);
      });
    });

    describe('when called, and invalid dependencies match metadata', () => {
      let getInstanceDependenciesTask: GetInstanceDependenciesTask;

      let constructorArgumentFixure: unknown;
      let propertyArgumentFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        getInstanceDependenciesTask = new GetInstanceDependenciesTask(
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndProperties,
        );

        constructorArgumentFixure = 'constructor argument';
        propertyArgumentFixture = 'property';

        try {
          getInstanceDependenciesTask.perform(
            [constructorArgumentFixure, Symbol()],
            propertyArgumentFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'Unexpected dependencies for service',
            ) as string,
          }),
        );
      });
    });
  });
});
