import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { GetInstanceDependenciesTaskGraphExpandCommandHandler } from './GetInstanceDependenciesTaskGraphExpandCommandHandler';

describe(GetInstanceDependenciesTaskGraphExpandCommandHandler.name, () => {
  let bindingServiceMock: jest.Mocked<BindingService>;
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let createCreateInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let metadataServiceFixtures: MetadataService;

  let getInstanceDependenciesTaskGraphExpandCommandHandler: GetInstanceDependenciesTaskGraphExpandCommandHandler;

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
    createCreateInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };
    metadataServiceFixtures = {
      _type: Symbol(),
    } as unknown as MetadataService;

    getInstanceDependenciesTaskGraphExpandCommandHandler =
      new GetInstanceDependenciesTaskGraphExpandCommandHandler(
        bindingServiceMock,
        containerRequestServiceFixture,
        containerSingletonServiceFixture,
        createCreateInstanceTaskGraphNodeCommandHandlerMock,
        metadataServiceFixtures,
      );
  });

  describe('.handle', () => {
    describe('having a Node fixture', () => {
      let nodeFixture: cuaktask.Node<
        cuaktask.Task<GetInstanceDependenciesTaskKind>
      >;

      beforeAll(() => {
        nodeFixture = {
          dependencies: undefined,
          element: new GetInstanceDependenciesTask(
            GetInstanceDependenciesTaskKindFixtures.withMetadataWithConstructorArgumentsOneAndPropertiesEmpty,
          ),
        };
      });

      describe('when called, and bindingService returns a ValueBinding', () => {
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

          bindingServiceMock.get.mockReturnValueOnce(ValueBindingFixtures.any);

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
            nodeFixture.element.kind.metadata.constructorArguments[0],
          );
        });

        it('should expand graph nodes', () => {
          expect(
            getInstanceDependenciesTaskGraphExpandCommandFixture.context.graph,
          ).toStrictEqual({
            nodes: new Set<cuaktask.Node<cuaktask.Task<TaskKind>>>([
              {
                dependencies: undefined,
                element: new CreateInstanceTask(
                  {
                    binding: ValueBindingFixtures.any,
                    requestId:
                      getInstanceDependenciesTaskGraphExpandCommandFixture
                        .context.requestId,
                    type: TaskKindType.createInstance,
                  },
                  containerRequestServiceFixture,
                  containerSingletonServiceFixture,
                ),
              },
            ]),
          });
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when called, and bindingService returns a TypeBinding', () => {
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
            nodeFixture.element.kind.metadata.constructorArguments[0],
          );
        });

        it('should call createCreateInstanceTaskGraphNodeCommandHandler.handle()', () => {
          const expectedCreateCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand =
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

        it('should expand graph nodes', () => {
          expect(
            getInstanceDependenciesTaskGraphExpandCommandFixture.context.graph,
          ).toStrictEqual({
            nodes: new Set<cuaktask.Node<cuaktask.Task<TaskKind>>>([
              createInstanceTaskKindGraphNodeDependencyFixture,
            ]),
          });
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
