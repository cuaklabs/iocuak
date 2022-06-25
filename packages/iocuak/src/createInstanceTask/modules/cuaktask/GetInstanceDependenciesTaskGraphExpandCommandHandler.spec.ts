import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('../../utils/addNodesToGraph');

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskGraphExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskGraphExpandCommand';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { addNodesToGraph } from '../../utils/addNodesToGraph';
import { GetInstanceDependenciesTaskGraphExpandCommandHandler } from './GetInstanceDependenciesTaskGraphExpandCommandHandler';

describe(GetInstanceDependenciesTaskGraphExpandCommandHandler.name, () => {
  let bindingServiceMock: jestMock.Mocked<BindingService>;
  let busMock: jestMock.Mocked<
    Handler<TaskGraphExpandCommand, void | Promise<void>>
  >;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let createCreateInstanceTaskGraphNodeCommandHandlerMock: jestMock.Mocked<
    Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let metadataServiceFixtures: MetadataService;

  let getInstanceDependenciesTaskGraphExpandCommandHandler: GetInstanceDependenciesTaskGraphExpandCommandHandler;

  beforeAll(() => {
    bindingServiceMock = {
      get: jest.fn(),
      getByTag: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;
    busMock = {
      handle: jest.fn(),
    };
    createCreateInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };
    metadataServiceFixtures = {
      _type: Symbol(),
    } as unknown as MetadataService;

    getInstanceDependenciesTaskGraphExpandCommandHandler =
      new GetInstanceDependenciesTaskGraphExpandCommandHandler(
        bindingServiceMock,
        busMock,
        createCreateInstanceTaskGraphNodeCommandHandlerMock,
        metadataServiceFixtures,
      );
  });

  describe('.handle', () => {
    describe('having a Node fixture with service metadata', () => {
      let nodeFixture: cuaktask.Node<
        cuaktask.Task<GetInstanceDependenciesTaskKind>
      >;

      beforeAll(() => {
        nodeFixture = {
          dependencies: undefined,
          element: new GetInstanceDependenciesTask(
            GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsOneServiceAndPropertiesEmpty,
          ),
        };
      });

      describe('when called, and bindingService.get() returns a Binding', () => {
        let getInstanceDependenciesTaskGraphExpandCommandFixture: GetInstanceDependenciesTaskGraphExpandCommand;
        let createInstanceTaskKindGraphNodeDependencyFixture: cuaktask.Node<
          cuaktask.Task<TaskKind>
        >;
        let result: unknown;

        beforeAll(() => {
          getInstanceDependenciesTaskGraphExpandCommandFixture = {
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
            taskKindType: TaskGraphExpandCommandType.getInstanceDependencies,
          };

          bindingServiceMock.get.mockReturnValueOnce(TypeBindingFixtures.any);

          createInstanceTaskKindGraphNodeDependencyFixture = {
            dependencies: undefined,
            element: new CreateInstanceTask(
              {
                binding: TypeBindingFixtures.any,
                requestId:
                  getInstanceDependenciesTaskGraphExpandCommandFixture.context
                    .requestId,
                type: TaskKindType.createInstance,
              },
              containerRequestServiceFixture,
              containerSingletonServiceFixture,
            ),
          };

          createCreateInstanceTaskGraphNodeCommandHandlerMock.handle.mockReturnValueOnce(
            createInstanceTaskKindGraphNodeDependencyFixture,
          );

          result = getInstanceDependenciesTaskGraphExpandCommandHandler.handle(
            getInstanceDependenciesTaskGraphExpandCommandFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindingService.get()', () => {
          expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
          expect(bindingServiceMock.get).toHaveBeenCalledWith(
            nodeFixture.element.kind.metadata.constructorArguments[0]?.value,
          );
        });

        it('should call createCreateInstanceTaskGraphNodeCommandHandler.handle()', () => {
          const expectedCreateCreateInstanceTaskGraphNodeCommand: CreateCreateTypeBindingInstanceTaskGraphNodeCommand =
            {
              context: {
                ...getInstanceDependenciesTaskGraphExpandCommandFixture.context,
                taskKind: {
                  binding: TypeBindingFixtures.any,
                  requestId:
                    getInstanceDependenciesTaskGraphExpandCommandFixture.context
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
          expect(addNodesToGraph).toHaveBeenCalledTimes(1);
          expect(addNodesToGraph).toHaveBeenCalledWith(
            getInstanceDependenciesTaskGraphExpandCommandFixture.context.graph,
            createInstanceTaskKindGraphNodeDependencyFixture,
          );
        });

        it('should set node dependencies', () => {
          const expectedNodeDependency: cuaktask.NodeDependency<
            cuaktask.Task<TaskKind>
          > = {
            nodes: [createInstanceTaskKindGraphNodeDependencyFixture],
            type: cuaktask.NodeDependenciesType.and,
          };

          expect(nodeFixture.dependencies).toStrictEqual(
            expectedNodeDependency,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a Node fixture with tag metadata', () => {
      let nodeFixture: cuaktask.Node<
        cuaktask.Task<GetInstanceDependenciesTaskKind>
      >;

      beforeAll(() => {
        nodeFixture = {
          dependencies: undefined,
          element: new GetInstanceDependenciesTask(
            GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsOneTagAndPropertiesEmpty,
          ),
        };
      });

      describe('when called, and bus.handle() returns void', () => {
        let getInstanceDependenciesTaskGraphExpandCommandFixture: GetInstanceDependenciesTaskGraphExpandCommand;

        let result: unknown;

        beforeAll(() => {
          getInstanceDependenciesTaskGraphExpandCommandFixture = {
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
            taskKindType: TaskGraphExpandCommandType.getInstanceDependencies,
          };

          result = getInstanceDependenciesTaskGraphExpandCommandHandler.handle(
            getInstanceDependenciesTaskGraphExpandCommandFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bus.handle()', () => {
          const expectedCreateTagInstancesTaskGraphExpandCommand: CreateTagInstancesTaskGraphExpandCommand =
            {
              context:
                getInstanceDependenciesTaskGraphExpandCommandFixture.context,
              node: {
                dependencies: undefined,
                element: new CreateTagInstancesTask({
                  tag: nodeFixture.element.kind.metadata.constructorArguments[0]
                    ?.value as BindingTag,
                  type: TaskKindType.createTagInstances,
                }),
              },
              taskKindType: TaskGraphExpandCommandType.createTagInstances,
            };
          expect(busMock.handle).toHaveBeenCalledTimes(1);
          expect(busMock.handle).toHaveBeenCalledWith(
            expectedCreateTagInstancesTaskGraphExpandCommand,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
