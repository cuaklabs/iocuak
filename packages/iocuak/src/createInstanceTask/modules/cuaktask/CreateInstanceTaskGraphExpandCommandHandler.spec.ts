import { Graph, Node, Task, TaskStatus } from '@cuaklabs/cuaktask';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../../createInstanceTask/models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateInstanceTaskGraphExpandCommandHandler } from './CreateInstanceTaskGraphExpandCommandHandler';

describe(CreateInstanceTaskGraphExpandCommandHandler.name, () => {
  let busMock: jest.Mocked<Handler<unknown, void | Promise<void>>>;
  let metadataService: jest.Mocked<MetadataService>;

  let createInstanceTaskGraphExpandCommandHandler: CreateInstanceTaskGraphExpandCommandHandler;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };

    metadataService = {
      getClassMetadata: jest.fn(),
    } as Partial<jest.Mocked<MetadataService>> as jest.Mocked<MetadataService>;

    createInstanceTaskGraphExpandCommandHandler =
      new CreateInstanceTaskGraphExpandCommandHandler(busMock, metadataService);
  });

  describe('having a CreateInstanceTaskGraphExpandCommand with node with create instance task with type binging', () => {
    let classMetadataFixture: ClassMetadata;
    let createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand;
    let expectedGetInstanteDependenciesNode: Node<
      GetInstanceDependenciesTask,
      Task<TaskKind>
    >;
    let graphFixture: Graph<Task<unknown>>;
    let nodeFixture: Node<Task<CreateInstanceTaskKind<TypeBinding>>>;

    beforeAll(() => {
      classMetadataFixture = ClassMetadataFixtures.any;

      nodeFixture = {
        dependencies: undefined,
        element: {
          kind: CreateInstanceTaskKindFixtures.withBindingType,
          perform: jest.fn(),
          result: undefined,
          status: TaskStatus.NotStarted,
        },
      };

      graphFixture = {
        nodes: [nodeFixture],
      };

      expectedGetInstanteDependenciesNode = {
        dependencies: undefined,
        element: new GetInstanceDependenciesTask({
          id: nodeFixture.element.kind.binding.id,
          metadata: classMetadataFixture,
          requestId: nodeFixture.element.kind.requestId,
          type: TaskKindType.getInstanceDependencies,
        }),
      };

      createInstanceTaskGraphExpandCommand = {
        context: {
          graph: graphFixture,
        } as Partial<CreateInstanceTaskGraphExpandOperationContext> as CreateInstanceTaskGraphExpandOperationContext,
        node: nodeFixture,
        taskKindType: TaskKindType.createInstance,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        metadataService.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture,
        );

        result = createInstanceTaskGraphExpandCommandHandler.handle(
          createInstanceTaskGraphExpandCommand,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bus', () => {
        const getInstanceDependenciesTraphGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand =
          {
            context: createInstanceTaskGraphExpandCommand.context,
            node: expectedGetInstanteDependenciesNode,
            taskKindType: TaskKindType.getInstanceDependencies,
          };

        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(
          getInstanceDependenciesTraphGraphExpandCommand,
        );
      });

      it('should expand graph', () => {
        expect(graphFixture).toStrictEqual<Graph<Task<unknown>>>({
          nodes: [nodeFixture, expectedGetInstanteDependenciesNode],
        });
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a CreateInstanceTaskGraphExpandCommand with node with create instance task with value binging', () => {
    let classMetadataFixture: ClassMetadata;
    let createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand;
    let graphFixture: Graph<Task<unknown>>;
    let nodeFixture: Node<Task<CreateInstanceTaskKind<ValueBinding>>>;

    beforeAll(() => {
      classMetadataFixture = ClassMetadataFixtures.any;

      nodeFixture = {
        dependencies: undefined,
        element: {
          kind: CreateInstanceTaskKindFixtures.withBindingValue,
          perform: jest.fn(),
          result: undefined,
          status: TaskStatus.NotStarted,
        },
      };

      graphFixture = {
        nodes: [nodeFixture],
      };

      createInstanceTaskGraphExpandCommand = {
        context: {
          graph: graphFixture,
        } as Partial<CreateInstanceTaskGraphExpandOperationContext> as CreateInstanceTaskGraphExpandOperationContext,
        node: nodeFixture,
        taskKindType: TaskKindType.createInstance,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        metadataService.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture,
        );

        result = createInstanceTaskGraphExpandCommandHandler.handle(
          createInstanceTaskGraphExpandCommand,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call bus', () => {
        expect(busMock.handle).not.toHaveBeenCalled();
      });

      it('should not expand graph', () => {
        expect(graphFixture).toStrictEqual<Graph<Task<unknown>>>({
          nodes: [nodeFixture],
        });
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
