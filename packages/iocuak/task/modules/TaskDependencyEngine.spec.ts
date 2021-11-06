import { Binding } from '../../binding/models/domain/Binding';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerMetadataService } from '../../container/services/domain/ContainerMetadataService';
import { ClassMetadataFixtures } from '../../metadata/fixtures/domain/ClassMetadataFixtures';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskScope } from '../models/domain/TaskScope';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(TaskDependencyEngine.name, () => {
  let containerBindingService: jest.Mocked<ContainerBindingService>;
  let containerMetadataService: jest.Mocked<ContainerMetadataService>;

  let taskDependencyEngine: TaskDependencyEngine;

  beforeAll(() => {
    containerBindingService = {
      get: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerBindingService>
    > as jest.Mocked<ContainerBindingService>;

    containerMetadataService = {
      getClassMetadata: jest.fn(),
    } as Partial<
      jest.Mocked<ContainerMetadataService>
    > as jest.Mocked<ContainerMetadataService>;

    taskDependencyEngine = new TaskDependencyEngine(
      containerBindingService,
      containerMetadataService,
    );
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
          containerBindingService.get.mockReturnValueOnce(undefined);

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

      describe('when called, and containerService.binding.get() returns a binding and containerService.metadata.get() returns metadata', () => {
        let bindingFixture: Binding;
        let result: unknown;

        beforeAll(() => {
          bindingFixture = {
            id: createInstanceTaskKindFixture.id,
            scope: TaskScope.transient,
            type: class {},
          };

          containerBindingService.get.mockReturnValueOnce(bindingFixture);

          containerMetadataService.getClassMetadata.mockReturnValueOnce(
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
              requestId: createInstanceTaskKindFixture.requestId,
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
              requestId: getInstanceDependenciesTaskKindFixture.requestId,
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
              id: ClassMetadataFixtures.withConstructorArgumentsEmptyAndProperties.properties
                .values()
                .next().value as ServiceId,
              requestId: getInstanceDependenciesTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
