import { ClassMetadataProvider } from '../../metadata/adapters/ClassMetadataProvider';
import { ClassMetadataFixtures } from '../../metadata/fixtures/domain/ClassMetadataFixtures';
import { CreateInstanceTaskKindFixtures } from '../fixtures/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskId } from '../models/domain/TaskId';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(TaskDependencyEngine.name, () => {
  let classMetadataProvider: jest.Mocked<ClassMetadataProvider>;

  let taskDependencyEngine: TaskDependencyEngine;

  beforeAll(() => {
    classMetadataProvider = {
      getMetadata: jest.fn(),
    };

    taskDependencyEngine = new TaskDependencyEngine(classMetadataProvider);
  });

  describe('.getDependencies()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let createInstanceTaskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        createInstanceTaskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          classMetadataProvider.getMetadata.mockReturnValueOnce(
            ClassMetadataFixtures.any,
          );

          result = taskDependencyEngine.getDependencies(
            createInstanceTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: createInstanceTaskKindFixture.id,
              metadata: ClassMetadataFixtures.any,
              type: TaskKindType.getInstanceDependencies,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with no dependencies', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsEmptyAndPropertiesEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = taskDependencyEngine.getDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          expect(result).toStrictEqual([]);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with constructor arguments', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsAndPropertiesEmpty;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = taskDependencyEngine.getDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: ClassMetadataFixtures
                .withConstructorArgumentsAndPropertiesEmpty
                .constructorArguments[0] as TaskId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind with properties', () => {
      let getInstanceDependenciesTaskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        getInstanceDependenciesTaskKindFixture =
          GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsEmptyAndProperties;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = taskDependencyEngine.getDependencies(
            getInstanceDependenciesTaskKindFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a TDependencyKind[]', () => {
          const expected: TaskKind[] = [
            {
              id: Object.values(
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndProperties
                  .properties,
              )[0] as TaskId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
