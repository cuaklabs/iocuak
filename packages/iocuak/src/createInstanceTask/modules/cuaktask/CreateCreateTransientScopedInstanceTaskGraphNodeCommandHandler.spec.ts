import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler } from './CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler';

describe(
  CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler.name,
  () => {
    let busMock: jest.Mocked<Handler<unknown, void | Promise<void>>>;
    let containerRequestServiceFixture: ContainerRequestService;
    let containerSingletonServiceFixture: ContainerSingletonService;

    let createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler;

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

      createCreateTransientScopedInstanceTaskGraphNodeCommandHandler =
        new CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler(
          busMock,
          containerRequestServiceFixture,
          containerSingletonServiceFixture,
        );
    });

    describe('.handle', () => {
      describe('when called', () => {
        let createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateInstanceTaskGraphNodeCommand;
        let createInstanceTaskKindGraphNode: cuaktask.Node<
          cuaktask.Task<CreateInstanceTaskKind>
        >;
        let result: unknown;

        beforeAll(() => {
          createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand = {
            context: {
              graph: {
                nodes: [],
              },
              serviceIdAncestorList: {
                _type: Symbol(),
              } as unknown as ReadOnlyLinkedList<ServiceId>,
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              taskKind: CreateInstanceTaskKindFixtures.withBindingType,
            },
          };

          createInstanceTaskKindGraphNode = {
            dependencies: undefined,
            element: new CreateInstanceTask(
              createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand.context.taskKind,
              containerRequestServiceFixture,
              containerSingletonServiceFixture,
            ),
          };

          busMock.handle.mockReturnValueOnce(undefined);

          result =
            createCreateTransientScopedInstanceTaskGraphNodeCommandHandler.handle(
              createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bus.handle()', () => {
          const createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand =
            {
              context:
                createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand.context,
              node: createInstanceTaskKindGraphNode,
              taskKindType: TaskKindType.createInstance,
            };

          expect(busMock.handle).toHaveBeenCalledTimes(1);
          expect(busMock.handle).toHaveBeenCalledWith(
            createInstanceTaskGraphExpandCommand,
          );
        });

        it('should return a NodeDependency', () => {
          expect(result).toStrictEqual(createInstanceTaskKindGraphNode);
        });
      });
    });
  },
);
