import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { CreateTagInstancesTaskKindFixtures } from '../../fixtures/domain/CreateTagInstancesTaskKindFixtures';
import { CreateCreateInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateTagInstancesTaskNodeExpandCommandHandler } from './CreateTagInstancesTaskNodeExpandCommandHandler';

describe(CreateTagInstancesTaskNodeExpandCommandHandler.name, () => {
  let bindingServiceMock: jestMock.Mocked<BindingService>;
  let createCreateInstanceTaskGraphNodeCommandHandlerMock: jestMock.Mocked<
    Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createTagInstancesTaskGraphExpandCommandHandler: CreateTagInstancesTaskNodeExpandCommandHandler;

  beforeAll(() => {
    bindingServiceMock = {
      getByTag: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;

    createCreateInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };

    createTagInstancesTaskGraphExpandCommandHandler =
      new CreateTagInstancesTaskNodeExpandCommandHandler(
        bindingServiceMock,
        createCreateInstanceTaskGraphNodeCommandHandlerMock,
      );
  });

  describe('.handle', () => {
    describe('when called', () => {
      let nodeFixture: cuaktask.Node<cuaktask.Task<CreateTagInstancesTaskKind>>;
      let createTagInstancesTaskGraphExpandCommandFixture: CreateTagInstancesTaskNodeExpandCommand;
      let createInstanceTaskKindGraphNodeDependencyFixture: cuaktask.Node<
        cuaktask.Task<TaskKind>
      >;

      let result: unknown;

      beforeAll(() => {
        nodeFixture = {
          dependencies: undefined,
          element: new CreateTagInstancesTask(
            CreateTagInstancesTaskKindFixtures.any,
          ),
        };

        createTagInstancesTaskGraphExpandCommandFixture = {
          context: {
            requestId: Symbol(),
            serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
            serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
            serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
          },
          node: nodeFixture,
          taskKindType: TaskNodeExpandCommandType.createTagInstances,
        };

        const containerRequestServiceFixture: ContainerRequestService = {
          _type: Symbol(),
        } as unknown as ContainerRequestService;
        const containerSingletonServiceFixture: ContainerSingletonService = {
          _type: Symbol(),
        } as unknown as ContainerSingletonService;

        createInstanceTaskKindGraphNodeDependencyFixture = {
          dependencies: undefined,
          element: new CreateInstanceTask(
            {
              binding: ValueBindingFixtures.any,
              requestId:
                createTagInstancesTaskGraphExpandCommandFixture.context
                  .requestId,
              type: TaskKindType.createInstance,
            },
            containerRequestServiceFixture,
            containerSingletonServiceFixture,
          ),
        };

        bindingServiceMock.getByTag.mockReturnValueOnce([
          ValueBindingFixtures.any,
        ]);

        createCreateInstanceTaskGraphNodeCommandHandlerMock.handle.mockReturnValueOnce(
          createInstanceTaskKindGraphNodeDependencyFixture,
        );

        result = createTagInstancesTaskGraphExpandCommandHandler.handle(
          createTagInstancesTaskGraphExpandCommandFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bindingService.getByTag()', () => {
        expect(bindingServiceMock.getByTag).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.getByTag).toHaveBeenCalledWith(
          nodeFixture.element.kind.tag,
          true,
        );
      });

      it('should call createCreateInstanceTaskGraphNodeCommandHandler.handle()', () => {
        const expectedCreateCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskNodeCommand =
          {
            context: {
              ...createTagInstancesTaskGraphExpandCommandFixture.context,
              taskKind: {
                binding: ValueBindingFixtures.any,
                requestId:
                  createTagInstancesTaskGraphExpandCommandFixture.context
                    .requestId,
                type: TaskKindType.createInstance,
              },
            },
          };

        expect(
          createCreateInstanceTaskGraphNodeCommandHandlerMock.handle,
        ).toHaveBeenCalledTimes(1);
        expect(
          createCreateInstanceTaskGraphNodeCommandHandlerMock.handle,
        ).toHaveBeenCalledWith(
          expectedCreateCreateInstanceTaskGraphNodeCommand,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
