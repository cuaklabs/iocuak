import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('../../../binding/utils/domain/lazyGetBindingOrThrow');
jest.mock('../../utils/addNodesToGraph');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceRootTaskKindFixtures } from '../../fixtures/domain/CreateInstanceRootTaskKindFixtures';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateTagInstancesRootTaskKindFixtures } from '../../fixtures/domain/CreateTagInstancesRootTaskKindFixtures';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceRootTaskKind } from '../../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { CreateTagInstancesRootTaskKind } from '../../models/domain/CreateTagInstancesRootTaskKind';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { addNodesToGraph } from '../../utils/addNodesToGraph';
import { CreateInstanceTaskGraphEngine } from './CreateInstanceTaskGraphEngine';

describe(CreateInstanceTaskGraphEngine.name, () => {
  let bindingServiceMock: jestMock.Mocked<BindingService>;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let metadataServiceFixture: MetadataService;
  let taskGraphExpandCommandHandlerMock: jestMock.Mocked<
    Handler<CreateInstanceTaskNodeExpandCommand, void | Promise<void>>
  >;

  let createInstancesTaskGraphEngine: CreateInstanceTaskGraphEngine;

  beforeAll(() => {
    bindingServiceMock = {
      get: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;
    containerRequestServiceFixture = {
      _type: Symbol(),
    } as unknown as ContainerRequestService;
    containerSingletonServiceFixture = {
      _type: Symbol(),
    } as unknown as ContainerSingletonService;
    metadataServiceFixture = {
      _type: Symbol(),
    } as unknown as MetadataService;
    taskGraphExpandCommandHandlerMock = {
      handle: jest.fn(),
    };

    createInstancesTaskGraphEngine = new CreateInstanceTaskGraphEngine(
      bindingServiceMock,
      containerRequestServiceFixture,
      containerSingletonServiceFixture,
      metadataServiceFixture,
      taskGraphExpandCommandHandlerMock,
    );
  });

  describe('.create', () => {
    describe('having a taskKind of type createInstanceRoot', () => {
      let taskKindFixture: CreateInstanceRootTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceRootTaskKindFixtures.any;
      });

      describe('when called and bindingService.get returns a binding', () => {
        let expectedCreateInstanceTaskNode: cuaktask.Node<
          cuaktask.Task<CreateInstanceTaskKind>
        >;
        let expectedRootedTaskGraph: cuaktask.RootedGraph<
          cuaktask.Task<TaskKind>
        >;
        let result: unknown;

        beforeAll(() => {
          expectedCreateInstanceTaskNode = {
            dependencies: undefined,
            element: new CreateInstanceTask(
              {
                binding: ValueBindingFixtures.any,
                requestId: taskKindFixture.requestId,
                type: TaskKindType.createInstance,
              },
              containerRequestServiceFixture,
              containerSingletonServiceFixture,
            ),
          };

          expectedRootedTaskGraph = {
            nodes: new Set(),
            root: expectedCreateInstanceTaskNode,
          };

          bindingServiceMock.get.mockReturnValueOnce(ValueBindingFixtures.any);

          result = createInstancesTaskGraphEngine.create(taskKindFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindingService.get()', () => {
          expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(bindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call taskGraphExpandCommandHandler.handle()', () => {
          const expectedParams: [CreateInstanceTaskNodeExpandCommand] = [
            {
              context: {
                requestId: taskKindFixture.requestId,
                serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
                serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
                serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              },
              node: expectedCreateInstanceTaskNode,
              taskKindType: TaskNodeExpandCommandType.createInstance,
            },
          ];

          expect(
            taskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(taskGraphExpandCommandHandlerMock.handle).toHaveBeenCalledWith(
            ...expectedParams,
          );
        });

        it('should call addNodesToGraph()', () => {
          expect(addNodesToGraph).toHaveBeenCalledTimes(1);
          expect(addNodesToGraph).toHaveBeenCalledWith(
            expectedRootedTaskGraph,
            expectedCreateInstanceTaskNode,
          );
        });

        it('should return a graph', () => {
          expect(result).toStrictEqual(expectedRootedTaskGraph);
        });
      });

      describe('when called and bindingService.get returns a undefined', () => {
        let expectedCreateInstanceTaskNode: cuaktask.Node<
          cuaktask.Task<CreateInstanceTaskKind>
        >;
        let expectedRootedTaskGraph: cuaktask.RootedGraph<
          cuaktask.Task<TaskKind>
        >;
        let result: unknown;

        beforeAll(() => {
          expectedCreateInstanceTaskNode = {
            dependencies: undefined,
            element: new CreateInstanceTask(
              {
                binding: TypeBindingFixtures.any,
                requestId: taskKindFixture.requestId,
                type: TaskKindType.createInstance,
              },
              containerRequestServiceFixture,
              containerSingletonServiceFixture,
            ),
          };

          expectedRootedTaskGraph = {
            nodes: new Set(),
            root: expectedCreateInstanceTaskNode,
          };

          bindingServiceMock.get.mockReturnValueOnce(undefined);

          (
            lazyGetBindingOrThrow as jestMock.Mock<typeof lazyGetBindingOrThrow>
          ).mockReturnValueOnce(TypeBindingFixtures.any);

          result = createInstancesTaskGraphEngine.create(taskKindFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindingService.get()', () => {
          expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(bindingServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.id,
          );
        });

        it('should call lazyGetBindingOrThrow', () => {
          expect(lazyGetBindingOrThrow).toHaveBeenCalledTimes(1);
          expect(lazyGetBindingOrThrow).toHaveBeenCalledWith(
            taskKindFixture.id,
            metadataServiceFixture,
          );
        });

        it('should call taskGraphExpandCommandHandler.handle()', () => {
          const expectedParams: [CreateInstanceTaskNodeExpandCommand] = [
            {
              context: {
                requestId: taskKindFixture.requestId,
                serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
                serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
                serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              },
              node: expectedCreateInstanceTaskNode,
              taskKindType: TaskNodeExpandCommandType.createInstance,
            },
          ];

          expect(
            taskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(taskGraphExpandCommandHandlerMock.handle).toHaveBeenCalledWith(
            ...expectedParams,
          );
        });

        it('should call addNodesToGraph()', () => {
          expect(addNodesToGraph).toHaveBeenCalledTimes(1);
          expect(addNodesToGraph).toHaveBeenCalledWith(
            expectedRootedTaskGraph,
            expectedCreateInstanceTaskNode,
          );
        });

        it('should return a graph', () => {
          expect(result).toStrictEqual(expectedRootedTaskGraph);
        });
      });
    });

    describe('having a taskKind of type createTagInstancesRoot', () => {
      let taskKindFixture: CreateTagInstancesRootTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateTagInstancesRootTaskKindFixtures.any;
      });

      describe('when called', () => {
        let expectedCreateTagInstancesTaskNode: cuaktask.Node<
          cuaktask.Task<CreateTagInstancesTaskKind>
        >;
        let expectedRootedTaskGraph: cuaktask.RootedGraph<
          cuaktask.Task<TaskKind>
        >;
        let result: unknown;

        beforeAll(() => {
          expectedCreateTagInstancesTaskNode = {
            dependencies: undefined,
            element: new CreateTagInstancesTask({
              tag: taskKindFixture.tag,
              type: TaskKindType.createTagInstances,
            }),
          };

          expectedRootedTaskGraph = {
            nodes: new Set(),
            root: expectedCreateTagInstancesTaskNode,
          };

          result = createInstancesTaskGraphEngine.create(taskKindFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call taskGraphExpandCommandHandler.handle()', () => {
          const expectedParams: [CreateTagInstancesTaskNodeExpandCommand] = [
            {
              context: {
                requestId: taskKindFixture.requestId,
                serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
                serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
                serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              },
              node: expectedCreateTagInstancesTaskNode,
              taskKindType: TaskNodeExpandCommandType.createTagInstances,
            },
          ];

          expect(
            taskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(taskGraphExpandCommandHandlerMock.handle).toHaveBeenCalledWith(
            ...expectedParams,
          );
        });

        it('should call addNodesToGraph()', () => {
          expect(addNodesToGraph).toHaveBeenCalledTimes(1);
          expect(addNodesToGraph).toHaveBeenCalledWith(
            expectedRootedTaskGraph,
            expectedCreateTagInstancesTaskNode,
          );
        });

        it('should return a graph', () => {
          expect(result).toStrictEqual(expectedRootedTaskGraph);
        });
      });
    });

    describe('having a taskKind of different type', () => {
      let taskKindFixture: TaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            createInstancesTaskGraphEngine.create(taskKindFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedError: Partial<Error> = {
            message: 'Unexpected task kind',
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(expect.objectContaining(expectedError));
        });
      });
    });
  });
});
