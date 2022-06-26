import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { DestructureOneTask } from '../../models/cuaktask/DestructureOneTask';
import { GetCachedInstanceTask } from '../../models/cuaktask/GetCachedInstanceTask';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler } from './BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler';
import { CreateInstanceTaskLazyNode } from './CreateInstanceTaskLazyNode';

class BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock extends BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler {
  #getServiceIdToNodeDependencyMapMock: jestMock.Mock<
    (
      context: CreateInstanceTaskNodeExpandOperationContext,
    ) => Map<ServiceId, cuaktask.NodeDependency<cuaktask.Task<TaskKind>>>
  >;

  constructor(
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    getServiceIdToCreateInstanceTaskKindNodeMapMock: jestMock.Mock<
      (
        context: CreateInstanceTaskNodeExpandOperationContext,
      ) => Map<ServiceId, cuaktask.NodeDependency<cuaktask.Task<TaskKind>>>
    >,
  ) {
    super(bus, containerRequestService, containerSingletonService);

    this.#getServiceIdToNodeDependencyMapMock =
      getServiceIdToCreateInstanceTaskKindNodeMapMock;
  }

  protected _getServiceIdToNodeDependencyMap(
    context: CreateInstanceTaskNodeExpandOperationContext,
  ): Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
  > {
    return this.#getServiceIdToNodeDependencyMapMock(context);
  }
}

describe(
  BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler.name,
  () => {
    let busMock: jestMock.Mocked<
      Handler<TaskNodeExpandCommand, void | Promise<void>>
    >;
    let containerRequestServiceFixture: ContainerRequestService;
    let containerSingletonServiceFixture: ContainerSingletonService;
    let getServiceIdToNodeDependencyMapMock: jestMock.Mock<
      (
        context: CreateInstanceTaskNodeExpandOperationContext,
      ) => Map<ServiceId, cuaktask.NodeDependency<cuaktask.Task<TaskKind>>>
    >;

    let baseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock: BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock;

    beforeAll(() => {
      busMock = {
        handle: jest.fn(),
      };
      containerRequestServiceFixture = {
        _type: Symbol(),
      } as unknown as ContainerRequestService;
      containerSingletonServiceFixture = {
        _type: Symbol(),
      } as unknown as ContainerSingletonService;
      getServiceIdToNodeDependencyMapMock =
        jest.fn<
          jestMock.Mock<
            (
              context: CreateInstanceTaskNodeExpandOperationContext,
            ) => Map<
              ServiceId,
              cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
            >
          >
        >();

      baseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock =
        new BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock(
          busMock,
          containerRequestServiceFixture,
          containerSingletonServiceFixture,
          getServiceIdToNodeDependencyMapMock,
        );
    });

    describe('.handle', () => {
      describe('when called and serviceIdToCreateInstanceTaskKindNodeDependencyMap returns undefined', () => {
        let serviceIdToCreateInstanceTaskKindNodeDependencyMapFixture: Map<
          ServiceId,
          cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
        >;

        let createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateTypeBindingInstanceTaskNodeCommand;

        let result: unknown;

        beforeAll(() => {
          createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand = {
            context: {
              requestId:
                CreateInstanceTaskKindFixtures.withBindingType.requestId,
              serviceIdAncestorList: {
                _type: Symbol(),
              } as unknown as ReadOnlyLinkedList<ServiceId>,
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              taskKind: CreateInstanceTaskKindFixtures.withBindingType,
            },
          };

          serviceIdToCreateInstanceTaskKindNodeDependencyMapFixture = new Map();

          getServiceIdToNodeDependencyMapMock.mockReturnValueOnce(
            serviceIdToCreateInstanceTaskKindNodeDependencyMapFixture,
          );

          result =
            baseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock.handle(
              createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a NodeDependency', () => {
          const expectedNodeDependency: cuaktask.Node<cuaktask.Task<TaskKind>> =
            {
              dependencies: {
                nodes: [
                  {
                    dependencies: undefined,
                    element: new GetCachedInstanceTask(
                      {
                        binding:
                          createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand
                            .context.taskKind.binding,
                        requestId:
                          createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand
                            .context.taskKind.requestId,
                        type: TaskKindType.getCachedInstance,
                      },
                      containerRequestServiceFixture,
                      containerSingletonServiceFixture,
                    ),
                  },
                  expect.any(
                    CreateInstanceTaskLazyNode,
                  ) as unknown as CreateInstanceTaskLazyNode,
                ],
                type: cuaktask.NodeDependenciesType.bitwiseOr,
              },
              element: new DestructureOneTask({
                type: TaskKindType.destructureOne,
              }),
            };

          expect(result).toStrictEqual(expectedNodeDependency);
        });
      });
    });
  },
);
