import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { CreateCreateTransientScopedInstanceTaskNodeCommandHandler } from './CreateCreateTransientScopedInstanceTaskNodeCommandHandler';

describe(CreateCreateTransientScopedInstanceTaskNodeCommandHandler.name, () => {
  let busMock: jest.Mocked<
    Handler<TaskNodeExpandCommand, void | Promise<void>>
  >;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;

  let createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: CreateCreateTransientScopedInstanceTaskNodeCommandHandler;

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
      new CreateCreateTransientScopedInstanceTaskNodeCommandHandler(
        busMock,
        containerRequestServiceFixture,
        containerSingletonServiceFixture,
      );
  });

  describe('.handle', () => {
    describe('when called', () => {
      let createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateTypeBindingInstanceTaskNodeCommand;
      let createInstanceTaskKindGraphNode: cuaktask.Node<
        cuaktask.Task<CreateInstanceTaskKind>
      >;
      let result: unknown;

      beforeAll(() => {
        createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand = {
          context: {
            requestId: CreateInstanceTaskKindFixtures.withBindingType.requestId,
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
        const createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand =
          {
            context:
              createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand.context,
            node: createInstanceTaskKindGraphNode,
            taskKindType: TaskNodeExpandCommandType.createInstance,
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
});
