import { Binding } from '../../../binding/models/domain/Binding';
import { ContainerService } from '../../../container/services/domain/ContainerService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ServiceDependenciesFixtures } from '../../fixtures/domain/ServiceDependenciesFixtures';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { TaskScope } from '../domain/TaskScope';
import { CreateInstanceTask } from './CreateInstanceTask';

class InstanceTest {
  constructor(public readonly foo?: string) {}
}

describe(CreateInstanceTask.name, () => {
  describe('.perform()', () => {
    describe('having a task', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-kind-id',
          type: TaskKindType.createInstance,
        };
      });

      describe('when called and containerService.binding.get() returns no binding', () => {
        let containerServiceMock: ContainerService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          containerServiceMock = {
            binding: {
              get: jest.fn().mockReturnValueOnce(undefined),
            },
          } as Partial<ContainerService> as ContainerService;

          createInstanceTask = new CreateInstanceTask(
            containerServiceMock,
            taskKindFixture,
          );

          try {
            createInstanceTask.perform(
              ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
            );
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerService.binding.get()', () => {
          expect(containerServiceMock.binding.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.binding.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should throw an error', () => {
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

      describe('when called and containerService.binding.get() returns a binding with transient scope', () => {
        let bindingFixture: Binding<InstanceTest, [] | [string]>;
        let containerServiceMock: ContainerService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          const instanceConstructorCallMock: jest.Mock<
            InstanceTest,
            [] | [string]
          > = jest
            .fn<InstanceTest, []>()
            .mockImplementation((foo?: string) => new InstanceTest(foo));

          bindingFixture = {
            id: 'sample-id',
            scope: TaskScope.transient,
            type: instanceConstructorCallMock,
          };

          containerServiceMock = {
            binding: {
              get: jest.fn().mockReturnValueOnce(bindingFixture),
            },
          } as Partial<ContainerService> as ContainerService;

          createInstanceTask = new CreateInstanceTask(
            containerServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerService.binding.get()', () => {
          expect(containerServiceMock.binding.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.binding.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call bindingFixture.type()', () => {
          expect(bindingFixture.type).toHaveBeenCalledTimes(1);
          expect(bindingFixture.type).toHaveBeenCalledWith(
            ...ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          );
        });

        it('should return an instance of InstanceTest with properties set', () => {
          expect(result).toBeInstanceOf(InstanceTest);

          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(result).toHaveProperty(key);
            expect((result as Record<string, unknown>)[key]).toBe(value);
          });
        });
      });

      describe('when called and containerService.binding.get() returns a binding with singleton scope and containerService.singleton.get() returns no instance', () => {
        let bindingFixture: Binding<InstanceTest, [] | [string]>;
        let containerServiceMock: ContainerService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          const instanceConstructorCallMock: jest.Mock<
            InstanceTest,
            [] | [string]
          > = jest
            .fn<InstanceTest, []>()
            .mockImplementation((foo?: string) => new InstanceTest(foo));

          bindingFixture = {
            id: taskKindFixture.id,
            scope: TaskScope.singleton,
            type: instanceConstructorCallMock,
          };

          containerServiceMock = {
            binding: {
              get: jest.fn().mockReturnValueOnce(bindingFixture),
            },
            singleton: {
              get: jest.fn().mockReturnValueOnce(undefined),
              set: jest.fn(),
            } as Partial<ContainerSingletonService>,
          } as Partial<ContainerService> as ContainerService;

          createInstanceTask = new CreateInstanceTask(
            containerServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerService.binding.get()', () => {
          expect(containerServiceMock.binding.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.binding.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerService.singleton.get()', () => {
          expect(containerServiceMock.singleton.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.singleton.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call bindingFixture.type()', () => {
          expect(bindingFixture.type).toHaveBeenCalledTimes(1);
          expect(bindingFixture.type).toHaveBeenCalledWith(
            ...ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          );
        });

        it('should call containerService.singleton.set()', () => {
          expect(containerServiceMock.singleton.set).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.singleton.set).toHaveBeenCalledWith(
            taskKindFixture.id,
            expect.any(InstanceTest),
          );
          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(containerServiceMock.singleton.set).toHaveBeenCalledWith(
              taskKindFixture.id,
              expect.objectContaining({ [key]: value }),
            );
          });
        });

        it('should return an instance of InstanceTest with properties set', () => {
          expect(result).toBeInstanceOf(InstanceTest);

          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(result).toHaveProperty(key);
            expect((result as Record<string, unknown>)[key]).toBe(value);
          });
        });
      });

      describe('when called and containerService.binding.get() returns a binding with singleton scope and containerService.singleton.get() returns an instance', () => {
        let bindingFixture: Binding<InstanceTest, [] | [string]>;
        let instanceTestFixture: InstanceTest;
        let containerServiceMock: ContainerService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          const instanceConstructorCallMock: jest.Mock<
            InstanceTest,
            [] | [string]
          > = jest.fn<InstanceTest, []>();

          bindingFixture = {
            id: 'sample-id',
            scope: TaskScope.singleton,
            type: instanceConstructorCallMock,
          };

          instanceTestFixture = new InstanceTest();

          containerServiceMock = {
            binding: {
              get: jest.fn().mockReturnValueOnce(bindingFixture),
            },
            singleton: {
              get: jest.fn().mockReturnValueOnce(instanceTestFixture),
            } as Partial<ContainerSingletonService>,
          } as Partial<ContainerService> as ContainerService;

          createInstanceTask = new CreateInstanceTask(
            containerServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerService.binding.get()', () => {
          expect(containerServiceMock.binding.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.binding.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerService.singleton.get()', () => {
          expect(containerServiceMock.singleton.get).toHaveBeenCalledTimes(1);
          expect(containerServiceMock.singleton.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should not call bindingFixture.type()', () => {
          expect(bindingFixture.type).not.toHaveBeenCalled();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBe(instanceTestFixture);
        });
      });
    });
  });
});
