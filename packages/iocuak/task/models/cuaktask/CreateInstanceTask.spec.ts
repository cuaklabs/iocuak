import { Binding } from '../../../binding/models/domain/Binding';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { ServiceDependenciesFixtures } from '../../fixtures/domain/ServiceDependenciesFixtures';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
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
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called and containerService.binding.get() returns no binding', () => {
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(undefined),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {} as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {} as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
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

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
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
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
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

          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(bindingFixture),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {} as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {} as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.binding.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
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
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
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

          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(bindingFixture),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {} as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {
            get: jest.fn().mockReturnValueOnce(undefined),
            set: jest.fn(),
          } as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerSingletonService.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
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

        it('should call containerSingletonService.set()', () => {
          expect(containerSingletonServiceMock.set).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
            taskKindFixture.id,
            expect.any(InstanceTest),
          );
          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
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
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
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

          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(bindingFixture),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {} as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {
            get: jest.fn().mockReturnValueOnce(instanceTestFixture),
          } as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerSingletonService.singleton.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
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

      describe('when called and containerService.binding.get() returns a binding with request scope and containerService.request.get() returns no instance', () => {
        let bindingFixture: Binding<InstanceTest, [] | [string]>;
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
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
            scope: TaskScope.request,
            type: instanceConstructorCallMock,
          };

          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(bindingFixture),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {
            get: jest.fn().mockReturnValueOnce(undefined),
            set: jest.fn(),
          } as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {} as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerRequestServiceMock.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
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

        it('should call containerRequestServiceMock.set()', () => {
          expect(containerRequestServiceMock.set).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.set).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.id,
            expect.any(InstanceTest),
          );
          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
              taskKindFixture.requestId,
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

      describe('when called and containerService.binding.get() returns a binding with request scope and containerService.request.get() returns an instance', () => {
        let bindingFixture: Binding<InstanceTest, [] | [string]>;
        let instanceTestFixture: InstanceTest;
        let containerBindingServiceMock: jest.Mocked<ContainerBindingService>;
        let containerRequestServiceMock: jest.Mocked<ContainerRequestService>;
        let containerSingletonServiceMock: jest.Mocked<ContainerSingletonService>;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          const instanceConstructorCallMock: jest.Mock<
            InstanceTest,
            [] | [string]
          > = jest.fn<InstanceTest, []>();

          bindingFixture = {
            id: 'sample-id',
            scope: TaskScope.request,
            type: instanceConstructorCallMock,
          };

          instanceTestFixture = new InstanceTest();

          containerBindingServiceMock = {
            get: jest.fn().mockReturnValueOnce(bindingFixture),
          } as Partial<
            jest.Mocked<ContainerBindingService>
          > as jest.Mocked<ContainerBindingService>;

          containerRequestServiceMock = {
            get: jest.fn().mockReturnValueOnce(instanceTestFixture),
          } as Partial<
            jest.Mocked<ContainerRequestService>
          > as jest.Mocked<ContainerRequestService>;

          containerSingletonServiceMock = {} as Partial<
            jest.Mocked<ContainerSingletonService>
          > as jest.Mocked<ContainerSingletonService>;

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerBindingServiceMock,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call containerRequestServiceMock.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
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
