import { Binding } from '../../binding/models/domain/Binding';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerService } from '../../container/services/domain/ContainerService';
import { ClassMetadataFixtures } from '../../metadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../metadata/models/domain/ClassMetadata';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { ServiceId } from '../models/domain/ServiceId';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskScope } from '../models/domain/TaskScope';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(TaskDependencyEngine.name, () => {
  let containerService: ContainerService;

  let taskDependencyEngine: TaskDependencyEngine;

  beforeAll(() => {
    containerService = {
      binding: {
        get: jest.fn(),
      } as Partial<ContainerBindingService>,
      metadata: {
        get: jest.fn(),
      },
    } as Partial<ContainerService> as ContainerService;

    taskDependencyEngine = new TaskDependencyEngine(containerService);
  });

  describe('.getDependencies()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let createInstanceTaskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        createInstanceTaskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called, and containerService.binding.get() returns undefined', () => {
        let result: unknown;

        beforeAll(() => {
          (
            containerService.binding.get as jest.Mock<Binding | undefined>
          ).mockReturnValueOnce(undefined);

          try {
            taskDependencyEngine.getDependencies(createInstanceTaskKindFixture);
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
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

      describe('when called, and containerService.binding.get() returns a binding and containerService.metadata.get() returns undefined', () => {
        let bindingFixture: Binding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = {
            id: createInstanceTaskKindFixture.id,
            scope: TaskScope.transient,
            type: class {},
          };

          (
            containerService.binding.get as jest.Mock<Binding>
          ).mockReturnValueOnce(bindingFixture);

          (
            containerService.metadata.get as jest.Mock<
              ClassMetadata | undefined
            >
          ).mockReturnValueOnce(undefined);

          try {
            taskDependencyEngine.getDependencies(createInstanceTaskKindFixture);
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: expect.stringContaining(
                'No metadata found for type',
              ) as string,
            }),
          );
        });
      });

      describe('when called, and containerService.binding.get() returns a binding and containerService.metadata.get() returns metadata', () => {
        let bindingFixture: Binding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = {
            id: createInstanceTaskKindFixture.id,
            scope: TaskScope.transient,
            type: class {},
          };

          (
            containerService.binding.get as jest.Mock<Binding>
          ).mockReturnValueOnce(bindingFixture);

          (
            containerService.metadata.get as jest.Mock<
              ClassMetadata | undefined
            >
          ).mockReturnValueOnce(ClassMetadataFixtures.any);

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
                .constructorArguments[0] as ServiceId,
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
              )[0] as ServiceId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
