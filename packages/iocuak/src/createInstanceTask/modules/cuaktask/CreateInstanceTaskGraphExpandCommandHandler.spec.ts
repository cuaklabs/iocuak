import { Graph, Node, Task, TaskStatus } from '@cuaklabs/cuaktask';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../../createInstanceTask/models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
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
    let serviceIdAncestorListMock: jest.Mocked<ReadOnlyLinkedList<ServiceId>>;
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

      serviceIdAncestorListMock = {
        concat: jest.fn(),
        includes: jest.fn(),
        [Symbol.iterator]: jest.fn(),
      };

      createInstanceTaskGraphExpandCommand = {
        context: {
          graph: graphFixture,
          serviceIdAncestorList: serviceIdAncestorListMock,
        } as Partial<CreateInstanceTaskGraphExpandOperationContext> as CreateInstanceTaskGraphExpandOperationContext,
        node: nodeFixture,
        taskKindType: TaskKindType.createInstance,
      };
    });

    describe('when called, and context.serviceIdAncestorList returns false', () => {
      let serviceIdAncestorListConcatFixture: ReadOnlyLinkedList<ServiceId>;

      let result: unknown;

      beforeAll(() => {
        metadataService.getClassMetadata.mockReturnValueOnce(
          classMetadataFixture,
        );

        serviceIdAncestorListConcatFixture = {
          _type: Symbol(),
        } as unknown as ReadOnlyLinkedList<ServiceId>;

        serviceIdAncestorListMock.concat.mockReturnValueOnce(
          serviceIdAncestorListConcatFixture,
        );
        serviceIdAncestorListMock.includes.mockReturnValueOnce(false);

        result = createInstanceTaskGraphExpandCommandHandler.handle(
          createInstanceTaskGraphExpandCommand,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call context.serviceIdAncestorList.includes', () => {
        expect(serviceIdAncestorListMock.includes).toHaveBeenCalledTimes(1);
        expect(serviceIdAncestorListMock.includes).toHaveBeenCalledWith(
          expect.any(Function),
        );
      });

      it('should call context.serviceIdAncestorList.concat', () => {
        expect(serviceIdAncestorListMock.concat).toHaveBeenCalledTimes(1);
        expect(serviceIdAncestorListMock.concat).toHaveBeenCalledWith(
          nodeFixture.element.kind.binding.id,
        );
      });

      it('should call bus', () => {
        const getInstanceDependenciesTraphGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand =
          {
            context: {
              ...createInstanceTaskGraphExpandCommand.context,
              serviceIdAncestorList: serviceIdAncestorListConcatFixture,
            },
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

    describe('when called, and context.serviceIdAncestorList returns true', () => {
      let result: unknown;

      beforeAll(async () => {
        serviceIdAncestorListMock.includes.mockReturnValueOnce(true);
        serviceIdAncestorListMock[Symbol.iterator].mockReturnValueOnce({
          next: (): IteratorResult<ServiceId> => ({
            done: true,
            value: undefined,
          }),
        });

        try {
          await createInstanceTaskGraphExpandCommandHandler.handle(
            createInstanceTaskGraphExpandCommand,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call context.serviceIdAncestorList.includes', () => {
        expect(serviceIdAncestorListMock.includes).toHaveBeenCalledTimes(1);
        expect(serviceIdAncestorListMock.includes).toHaveBeenCalledWith(
          expect.any(Function),
        );
      });

      it('should call context.serviceIdAncestorList[Symbol.iterator]', () => {
        expect(
          serviceIdAncestorListMock[Symbol.iterator],
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceIdAncestorListMock[Symbol.iterator],
        ).toHaveBeenCalledWith();
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: expect.stringContaining(
              'Circular dependency found related to',
            ) as string,
          }),
        );
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
