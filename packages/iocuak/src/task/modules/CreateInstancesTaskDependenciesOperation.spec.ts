import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('../../binding/utils/domain/lazyGetBindingOrThrow');

import { TypeBindingFixtures } from '../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../binding/fixtures/domain/ValueBindingFixtures';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassMetadataFixtures } from '../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceRootTaskKindFixtures } from '../fixtures/domain/CreateInstanceRootTaskKindFixtures';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceRootTaskKind } from '../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { CreateInstancesTaskDependenciesOperation } from './CreateInstancesTaskDependenciesOperation';

describe(CreateInstancesTaskDependenciesOperation.name, () => {
  let containerBindingServiceMock: jest.Mocked<BindingService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;
  let taskKindSetBuilderMock: jest.Mocked<Builder<SetLike<TaskKind>>>;

  beforeAll(() => {
    containerBindingServiceMock = {
      get: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
    metadataServiceMock = {
      getClassMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;
    taskKindSetBuilderMock = {
      build: jest.fn(),
    };
  });

  describe('.run', () => {
    describe('having a TaskKind with type getInstanceDependencies', () => {
      let taskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        taskKindFixture = GetInstanceDependenciesTaskKindFixtures.any;
      });

      describe('when called', () => {
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              taskKindFixture,
              taskKindSetBuilderMock,
            );

          try {
            createInstancesTaskDependencyEngineOperation.run();
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unsupported type',
            }),
          );
        });
      });
    });

    describe('having a TaskKind with type createInstance', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called', () => {
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              taskKindFixture,
              taskKindSetBuilderMock,
            );

          try {
            createInstancesTaskDependencyEngineOperation.run();
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unsupported type',
            }),
          );
        });
      });
    });

    describe('having a TaskKind with type createInstanceRoot', () => {
      let createInstanceRootTaskKindFixture: CreateInstanceRootTaskKind;

      beforeAll(() => {
        createInstanceRootTaskKindFixture =
          CreateInstanceRootTaskKindFixtures.any;
      });

      describe('when called, and containerService.binding.get() returns undefined', () => {
        let bindingFixture: TypeBinding;
        let createInstanceTaskKindFixture: CreateInstanceTaskKind;
        let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              createInstanceRootTaskKindFixture,
              taskKindSetBuilderMock,
            );

          bindingFixture = TypeBindingFixtures.any;
          createInstanceTaskKindFixture = {
            binding: bindingFixture,
            requestId: createInstanceRootTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };
          taskKindSetMock = {
            add: jest.fn(),
            delete: jest.fn(),
            has: jest.fn().mockReturnValueOnce(false),
          } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
            SetLike<TaskKind>
          >;

          containerBindingServiceMock.get.mockReturnValueOnce(undefined);
          taskKindSetBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

          (lazyGetBindingOrThrow as jest.Mock<TypeBinding>).mockReturnValueOnce(
            bindingFixture,
          );

          metadataServiceMock.getClassMetadata.mockReturnValueOnce(
            ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );

          result = createInstancesTaskDependencyEngineOperation.run();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call taskKindSerBuilder.build()', () => {
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledWith();
        });

        it('should call taskKindSet.has()', () => {
          expect(taskKindSetMock.has).toHaveBeenCalledTimes(1);
          expect(taskKindSetMock.has).toHaveBeenCalledWith(
            createInstanceTaskKindFixture,
          );
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            createInstanceRootTaskKindFixture.id,
          );
        });

        it('should call lazyGetBindingOrThrow()', () => {
          expect(lazyGetBindingOrThrow).toHaveBeenCalledTimes(1);
          expect(lazyGetBindingOrThrow).toHaveBeenCalledWith(
            createInstanceRootTaskKindFixture.id,
            metadataServiceMock,
          );
        });

        it('should call metadataService.getClassMetadata', () => {
          expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledTimes(1);
          expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledWith(
            bindingFixture.type,
          );
        });

        it('should return a task kind graph', () => {
          const dependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [],
            kind: {
              id: createInstanceTaskKindFixture.binding.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [dependencyTaskKindGraphNode],
            kind: createInstanceTaskKindFixture,
          };

          const expectedKindGraph: cuaktask.TaskDependencyKindGraph<
            TaskKind,
            TaskKind
          > = {
            nodes: [expectedKindGraphNode, dependencyTaskKindGraphNode],
            rootNode: expectedKindGraphNode,
          };

          expect(result).toStrictEqual(expectedKindGraph);
        });
      });

      describe('when called, and containerService.binding.get() returns a ValueBinding', () => {
        let bindingFixture: ValueBinding;
        let createInstanceTaskKindFixture: CreateInstanceTaskKind;
        let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              createInstanceRootTaskKindFixture,
              taskKindSetBuilderMock,
            );

          bindingFixture = ValueBindingFixtures.any;
          createInstanceTaskKindFixture = {
            binding: bindingFixture,
            requestId: createInstanceRootTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };
          taskKindSetMock = {
            add: jest.fn(),
            delete: jest.fn(),
            has: jest.fn().mockReturnValueOnce(false),
          } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
            SetLike<TaskKind>
          >;

          containerBindingServiceMock.get.mockReturnValueOnce(bindingFixture);
          taskKindSetBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

          result = createInstancesTaskDependencyEngineOperation.run();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerBindingService.get()', () => {
          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerBindingServiceMock.get).toHaveBeenCalledWith(
            createInstanceRootTaskKindFixture.id,
          );
        });

        it('should return a task kind graph', () => {
          const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [],
            kind: createInstanceTaskKindFixture,
          };

          const expectedKindGraph: cuaktask.TaskDependencyKindGraph<
            TaskKind,
            TaskKind
          > = {
            nodes: [expectedKindGraphNode],
            rootNode: expectedKindGraphNode,
          };

          expect(result).toStrictEqual(expectedKindGraph);
        });
      });

      describe('when called, and containerService.binding.get() returns a TypeBinding and metadataService.getClassMetadata returns metadata with constructor arguments', () => {
        let bindingFixture: TypeBinding;
        let createInstanceTaskKindFixture: CreateInstanceTaskKind;
        let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              createInstanceRootTaskKindFixture,
              taskKindSetBuilderMock,
            );

          bindingFixture = TypeBindingFixtures.any;
          createInstanceTaskKindFixture = {
            binding: bindingFixture,
            requestId: createInstanceRootTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };
          taskKindSetMock = {
            add: jest.fn(),
            delete: jest.fn(),
            has: jest
              .fn()
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
            SetLike<TaskKind>
          >;

          taskKindSetBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

          containerBindingServiceMock.get
            .mockReturnValueOnce(bindingFixture)
            .mockReturnValueOnce(bindingFixture);

          metadataServiceMock.getClassMetadata
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsOneAndPropertiesEmpty,
            )
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
            );

          result = createInstancesTaskDependencyEngineOperation.run();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call taskKindSerBuilder.build()', () => {
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledWith();
        });

        it('should call taskKindSet.has()', () => {
          const expectedSecondArgument: CreateInstanceTaskKind = {
            binding: bindingFixture,
            requestId: createInstanceTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };

          expect(taskKindSetMock.has).toHaveBeenCalledTimes(2);
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            1,
            createInstanceTaskKindFixture,
          );
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
        });

        it('should call containerBindingService.get()', () => {
          const expectedSecondArgument: ServiceId = ClassMetadataFixtures
            .withConstructorArgumentsOneAndPropertiesEmpty
            .constructorArguments[0] as ServiceId;

          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(2);
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            1,
            createInstanceRootTaskKindFixture.id,
          );
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
        });

        it('should call metadataService.getClassMetadata()', () => {
          expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledTimes(2);
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            1,
            bindingFixture.type,
          );
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            2,
            bindingFixture.type,
          );
        });

        it('should return a task kind graph', () => {
          const getInstanceConstructorDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [],
            kind: {
              id: bindingFixture.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const constructorDependencyKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceConstructorDependencyTaskKindGraphNode],
            kind: {
              binding: bindingFixture,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          };

          const getInstanceDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [constructorDependencyKindGraphNode],
            kind: {
              id: createInstanceTaskKindFixture.binding.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsOneAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceDependencyTaskKindGraphNode],
            kind: createInstanceTaskKindFixture,
          };

          const expectedKindGraph: cuaktask.TaskDependencyKindGraph<
            TaskKind,
            TaskKind
          > = {
            nodes: [
              expectedKindGraphNode,
              getInstanceDependencyTaskKindGraphNode,
              constructorDependencyKindGraphNode,
              getInstanceConstructorDependencyTaskKindGraphNode,
            ],
            rootNode: expectedKindGraphNode,
          };

          expect(result).toStrictEqual(expectedKindGraph);
        });
      });

      describe('when called, and containerService.binding.get() returns a TypeBinding and metadataService.getClassMetadata returns metadata with properties arguments', () => {
        let bindingFixture: TypeBinding;
        let createInstanceTaskKindFixture: CreateInstanceTaskKind;
        let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              createInstanceRootTaskKindFixture,
              taskKindSetBuilderMock,
            );

          bindingFixture = TypeBindingFixtures.any;
          createInstanceTaskKindFixture = {
            binding: bindingFixture,
            requestId: createInstanceRootTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };
          taskKindSetMock = {
            add: jest.fn(),
            delete: jest.fn(),
            has: jest
              .fn()
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
            SetLike<TaskKind>
          >;

          taskKindSetBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

          containerBindingServiceMock.get
            .mockReturnValueOnce(bindingFixture)
            .mockReturnValueOnce(bindingFixture);

          metadataServiceMock.getClassMetadata
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesOne,
            )
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
            );

          result = createInstancesTaskDependencyEngineOperation.run();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call taskKindSerBuilder.build()', () => {
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledWith();
        });

        it('should call taskKindSet.has()', () => {
          const expectedSecondArgument: CreateInstanceTaskKind = {
            binding: bindingFixture,
            requestId: createInstanceTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };

          expect(taskKindSetMock.has).toHaveBeenCalledTimes(2);
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            1,
            createInstanceTaskKindFixture,
          );
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
        });

        it('should call containerBindingService.get()', () => {
          const expectedSecondArgument: ServiceId = [
            ...ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesOne.properties.values(),
          ][0] as ServiceId;

          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(2);
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            1,
            createInstanceRootTaskKindFixture.id,
          );
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
        });

        it('should call metadataService.getClassMetadata()', () => {
          expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledTimes(2);
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            1,
            bindingFixture.type,
          );
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            2,
            bindingFixture.type,
          );
        });

        it('should return a task kind graph', () => {
          const getInstanceConstructorDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [],
            kind: {
              id: bindingFixture.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const constructorDependencyKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceConstructorDependencyTaskKindGraphNode],
            kind: {
              binding: bindingFixture,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          };

          const getInstanceDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [constructorDependencyKindGraphNode],
            kind: {
              id: createInstanceTaskKindFixture.binding.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesOne,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceDependencyTaskKindGraphNode],
            kind: createInstanceTaskKindFixture,
          };

          const expectedKindGraph: cuaktask.TaskDependencyKindGraph<
            TaskKind,
            TaskKind
          > = {
            nodes: [
              expectedKindGraphNode,
              getInstanceDependencyTaskKindGraphNode,
              constructorDependencyKindGraphNode,
              getInstanceConstructorDependencyTaskKindGraphNode,
            ],
            rootNode: expectedKindGraphNode,
          };

          expect(result).toStrictEqual(expectedKindGraph);
        });
      });

      describe('when called, and containerService.binding.get() returns a TypeBinding on singleton scope and metadataService.getClassMetadata returns metadata with the same two constructor arguments', () => {
        let bindingFixture: TypeBinding;
        let createInstanceTaskKindFixture: CreateInstanceTaskKind;
        let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
        let createInstancesTaskDependencyEngineOperation: CreateInstancesTaskDependenciesOperation;

        let result: unknown;

        beforeAll(() => {
          createInstancesTaskDependencyEngineOperation =
            new CreateInstancesTaskDependenciesOperation(
              containerBindingServiceMock,
              metadataServiceMock,
              createInstanceRootTaskKindFixture,
              taskKindSetBuilderMock,
            );

          bindingFixture = TypeBindingFixtures.withScopeSingleton;
          createInstanceTaskKindFixture = {
            binding: bindingFixture,
            requestId: createInstanceRootTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };
          taskKindSetMock = {
            add: jest.fn(),
            delete: jest.fn(),
            has: jest
              .fn()
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
            SetLike<TaskKind>
          >;

          taskKindSetBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

          containerBindingServiceMock.get
            .mockReturnValueOnce(bindingFixture)
            .mockReturnValueOnce(bindingFixture)
            .mockReturnValueOnce(bindingFixture);

          metadataServiceMock.getClassMetadata
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsTheSameTwoAndPropertiesEmpty,
            )
            .mockReturnValueOnce(
              ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
            );

          result = createInstancesTaskDependencyEngineOperation.run();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call taskKindSerBuilder.build()', () => {
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(taskKindSetBuilderMock.build).toHaveBeenCalledWith();
        });

        it('should call taskKindSet.has()', () => {
          const expectedSecondArgument: CreateInstanceTaskKind = {
            binding: bindingFixture,
            requestId: createInstanceTaskKindFixture.requestId,
            type: TaskKindType.createInstance,
          };

          expect(taskKindSetMock.has).toHaveBeenCalledTimes(2);
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            1,
            createInstanceTaskKindFixture,
          );
          expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
        });

        it('should call containerBindingService.get()', () => {
          const expectedSecondArgument: ServiceId = ClassMetadataFixtures
            .withConstructorArgumentsTheSameTwoAndPropertiesEmpty
            .constructorArguments[0] as ServiceId;

          const expectedThirdArgument: ServiceId = ClassMetadataFixtures
            .withConstructorArgumentsTheSameTwoAndPropertiesEmpty
            .constructorArguments[1] as ServiceId;

          expect(containerBindingServiceMock.get).toHaveBeenCalledTimes(3);
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            1,
            createInstanceRootTaskKindFixture.id,
          );
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            2,
            expectedSecondArgument,
          );
          expect(containerBindingServiceMock.get).toHaveBeenNthCalledWith(
            3,
            expectedThirdArgument,
          );
        });

        it('should call metadataService.getClassMetadata()', () => {
          expect(metadataServiceMock.getClassMetadata).toHaveBeenCalledTimes(2);
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            1,
            bindingFixture.type,
          );
          expect(metadataServiceMock.getClassMetadata).toHaveBeenNthCalledWith(
            2,
            bindingFixture.type,
          );
        });

        it('should return a task kind graph', () => {
          const getInstanceConstructorDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [],
            kind: {
              id: bindingFixture.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const constructorDependencyKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceConstructorDependencyTaskKindGraphNode],
            kind: {
              binding: bindingFixture,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.createInstance,
            },
          };

          const getInstanceDependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [
              constructorDependencyKindGraphNode,
              constructorDependencyKindGraphNode,
            ],
            kind: {
              id: createInstanceTaskKindFixture.binding.id,
              metadata:
                ClassMetadataFixtures.withConstructorArgumentsTheSameTwoAndPropertiesEmpty,
              requestId: createInstanceTaskKindFixture.requestId,
              type: TaskKindType.getInstanceDependencies,
            },
          };
          const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<
            TaskKind,
            TaskKind
          > = {
            dependencies: [getInstanceDependencyTaskKindGraphNode],
            kind: createInstanceTaskKindFixture,
          };

          const expectedKindGraph: cuaktask.TaskDependencyKindGraph<
            TaskKind,
            TaskKind
          > = {
            nodes: [
              expectedKindGraphNode,
              getInstanceDependencyTaskKindGraphNode,
              constructorDependencyKindGraphNode,
              getInstanceConstructorDependencyTaskKindGraphNode,
            ],
            rootNode: expectedKindGraphNode,
          };

          expect(result).toStrictEqual(expectedKindGraph);
        });
      });
    });
  });
});
