import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetCachedInstanceTask } from '../../models/cuaktask/GetCachedInstanceTask';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler } from './BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler';
import { CreateInstanceTaskLazyNode } from './CreateInstanceTaskLazyNode';

class BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandlerMock extends BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler {
  #getServiceIdToNodeDependencyMapMock: jest.Mock<
    Map<
      ServiceId,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
    >,
    [CreateInstanceTaskGraphExpandOperationContext]
  >;

  constructor(
    bus: Handler<unknown, void | Promise<void>>,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    getServiceIdToCreateInstanceTaskKindNodeMapMock: jest.Mock<
      Map<
        ServiceId,
        cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
      >,
      [CreateInstanceTaskGraphExpandOperationContext]
    >,
  ) {
    super(bus, containerRequestService, containerSingletonService);

    this.#getServiceIdToNodeDependencyMapMock =
      getServiceIdToCreateInstanceTaskKindNodeMapMock;
  }

  protected _getServiceIdToNodeDependencyMap(
    context: CreateInstanceTaskGraphExpandOperationContext,
  ): Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
  > {
    return this.#getServiceIdToNodeDependencyMapMock(context);
  }
}

describe(
  BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler.name,
  () => {
    let busMock: jest.Mocked<Handler<unknown, void | Promise<void>>>;
    let containerRequestServiceFixture: ContainerRequestService;
    let containerSingletonServiceFixture: ContainerSingletonService;
    let getServiceIdToNodeDependencyMapMock: jest.Mock<
      Map<
        ServiceId,
        cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
      >,
      [CreateInstanceTaskGraphExpandOperationContext]
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
      getServiceIdToNodeDependencyMapMock = jest.fn<
        Map<
          ServiceId,
          cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
        >,
        [CreateInstanceTaskGraphExpandOperationContext]
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

        let createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateInstanceTaskGraphNodeCommand;

        let result: unknown;

        beforeAll(() => {
          createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand = {
            context: {
              graph: {
                nodes: new Set(),
              },
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

        it('should return a NodeDependency', () => {
          expect(result).toStrictEqual<
            cuaktask.BitwiseOrNodeDependencies<cuaktask.Task<TaskKind>>
          >({
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
              ) as CreateInstanceTaskLazyNode,
            ],
            type: cuaktask.NodeDependenciesType.bitwiseOr,
          });
        });
      });
    });
  },
);
