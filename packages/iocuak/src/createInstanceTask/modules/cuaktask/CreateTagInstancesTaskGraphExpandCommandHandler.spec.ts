import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('../../utils/addNodesToGraph');

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { CreateTagInstancesTaskKindFixtures } from '../../fixtures/domain/CreateTagInstancesTaskKindFixtures';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskGraphExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { addNodesToGraph } from '../../utils/addNodesToGraph';
import { CreateTagInstancesTaskGraphExpandCommandHandler } from './CreateTagInstancesTaskGraphExpandCommandHandler';

describe(CreateTagInstancesTaskGraphExpandCommandHandler.name, () => {
  let bindingServiceMock: jestMock.Mocked<BindingService>;
  let createCreateInstanceTaskGraphNodeCommandHandlerMock: jestMock.Mocked<
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createTagInstancesTaskGraphExpandCommandHandler: CreateTagInstancesTaskGraphExpandCommandHandler;

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
      new CreateTagInstancesTaskGraphExpandCommandHandler(
        bindingServiceMock,
        createCreateInstanceTaskGraphNodeCommandHandlerMock,
      );
  });

  describe('.handle', () => {
    describe('when called', () => {
      let nodeFixture: cuaktask.Node<cuaktask.Task<CreateTagInstancesTaskKind>>;
      let createTagInstancesTaskGraphExpandCommandFixture: CreateTagInstancesTaskGraphExpandCommand;
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
            graph: {
              nodes: new Set(),
            },
            requestId: Symbol(),
            serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
            serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
            serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
          },
          node: nodeFixture,
          taskKindType: TaskGraphExpandCommandType.createTagInstances,
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
        const expectedCreateCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand =
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

      it('should call addNodesToGraph()', () => {
        const expectedNodeDependency: cuaktask.NodeDependency<
          cuaktask.Task<TaskKind>
        > = {
          nodes: [createInstanceTaskKindGraphNodeDependencyFixture],
          type: cuaktask.NodeDependenciesType.and,
        };

        expect(addNodesToGraph).toHaveBeenCalledTimes(1);
        expect(addNodesToGraph).toHaveBeenCalledWith(
          createTagInstancesTaskGraphExpandCommandFixture.context.graph,
          expectedNodeDependency,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
