import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('../../../binding/utils/domain/lazyGetBindingOrThrow');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceRootTaskKindFixtures } from '../../fixtures/domain/CreateInstanceRootTaskKindFixtures';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceRootTaskKind } from '../../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateInstanceTaskGraphEngine } from './CreateInstanceTaskGraphEngine';

describe(CreateInstanceTaskGraphEngine.name, () => {
  let bindingServiceMock: jest.Mocked<BindingService>;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let metadataServiceFixture: MetadataService;
  let taskGraphExpandCommandHandlerMock: jest.Mocked<
    Handler<CreateInstanceTaskGraphExpandCommand, void | Promise<void>>
  >;

  let createInstancesTaskGraphEngine: CreateInstanceTaskGraphEngine;

  beforeAll(() => {
    bindingServiceMock = {
      get: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
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
            nodes: new Set([expectedCreateInstanceTaskNode]),
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
          expect(
            taskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(taskGraphExpandCommandHandlerMock.handle).toHaveBeenCalledWith<
            [CreateInstanceTaskGraphExpandCommand]
          >({
            context: {
              graph: expectedRootedTaskGraph,
              serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
            },
            node: expectedCreateInstanceTaskNode,
            taskKindType: TaskKindType.createInstance,
          });
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
            nodes: new Set([expectedCreateInstanceTaskNode]),
            root: expectedCreateInstanceTaskNode,
          };

          bindingServiceMock.get.mockReturnValueOnce(undefined);

          (lazyGetBindingOrThrow as jest.Mock<Binding>).mockReturnValueOnce(
            TypeBindingFixtures.any,
          );

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
          expect(
            taskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(taskGraphExpandCommandHandlerMock.handle).toHaveBeenCalledWith<
            [CreateInstanceTaskGraphExpandCommand]
          >({
            context: {
              graph: expectedRootedTaskGraph,
              serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
            },
            node: expectedCreateInstanceTaskNode,
            taskKindType: TaskKindType.createInstance,
          });
        });

        it('should return a graph', () => {
          expect(result).toStrictEqual(expectedRootedTaskGraph);
        });
      });
    });

    describe('having a taskKind of type different than createInstanceRoot', () => {
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
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unexpected task kind',
            }),
          );
        });
      });
    });
  });
});
