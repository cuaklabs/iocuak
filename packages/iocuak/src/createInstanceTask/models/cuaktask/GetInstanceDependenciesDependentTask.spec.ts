import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { ServiceDependencies } from '../domain/ServiceDependencies';
import { GetInstanceDependenciesDependentTask } from './GetInstanceDependenciesDependentTask';

describe(GetInstanceDependenciesDependentTask.name, () => {
  let getInstanceDependenciesTask: GetInstanceDependenciesDependentTask;

  beforeAll(() => {
    getInstanceDependenciesTask = new GetInstanceDependenciesDependentTask(
      GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndProperties,
    );
  });

  describe('.perform()', () => {
    describe('when called, and dependencies do not match metadata', () => {
      let result: unknown;

      beforeAll(() => {
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
      let constructorArgumentFixure: unknown;
      let propertyArgumentFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        constructorArgumentFixure = 'constructor argument';
        propertyArgumentFixture = 'property';

        result = getInstanceDependenciesTask.perform(
          constructorArgumentFixure,
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
  });
});
