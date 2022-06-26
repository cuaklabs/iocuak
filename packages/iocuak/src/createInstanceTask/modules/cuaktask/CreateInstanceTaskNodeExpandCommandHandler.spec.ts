import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { ClassMetadataFixtures } from '../../../classMetadata/fixtures/domain/ClassMetadataFixtures';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskNodeExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateInstanceTaskNodeExpandCommandHandler } from './CreateInstanceTaskNodeExpandCommandHandler';

describe(CreateInstanceTaskNodeExpandCommandHandler.name, () => {
  let busMock: jestMock.Mocked<
    Handler<TaskNodeExpandCommand, void | Promise<void>>
  >;
  let metadataService: jestMock.Mocked<MetadataService>;

  let createInstanceTaskGraphExpandCommandHandler: CreateInstanceTaskNodeExpandCommandHandler;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };

    metadataService = {
      getClassMetadata: jest.fn(),
    } as Partial<
      jestMock.Mocked<MetadataService>
    > as jestMock.Mocked<MetadataService>;

    createInstanceTaskGraphExpandCommandHandler =
      new CreateInstanceTaskNodeExpandCommandHandler(busMock, metadataService);
  });

  describe('having a CreateInstanceTaskGraphExpandCommand with node with create instance task with type binging', () => {
    let classMetadataFixture: ClassMetadata;
    let serviceIdAncestorListMock: jestMock.Mocked<
      ReadOnlyLinkedList<ServiceId>
    >;
    let createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand;
    let expectedGetInstanteDependenciesNode: cuaktask.Node<
      GetInstanceDependenciesTask,
      cuaktask.Task<TaskKind>
    >;
    let nodeFixture: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind<TypeBinding>>
    >;

    beforeAll(() => {
      classMetadataFixture = ClassMetadataFixtures.any;

      nodeFixture = {
        dependencies: undefined,
        element: {
          kind: CreateInstanceTaskKindFixtures.withBindingType,
          perform: jest.fn(),
          result: undefined,
          status: cuaktask.TaskStatus.NotStarted,
        },
      };

      expectedGetInstanteDependenciesNode = {
        dependencies: undefined,
        element: new GetInstanceDependenciesTask({
          id: nodeFixture.element.kind.binding.id,
          metadata: classMetadataFixture,
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
          serviceIdAncestorList: serviceIdAncestorListMock,
        } as Partial<CreateInstanceTaskNodeExpandOperationContext> as CreateInstanceTaskNodeExpandOperationContext,
        node: nodeFixture,
        taskKindType: TaskNodeExpandCommandType.createInstance,
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
        const getInstanceDependenciesTraphGraphExpandCommand: GetInstanceDependenciesTaskNodeExpandCommand =
          {
            context: {
              ...createInstanceTaskGraphExpandCommand.context,
              serviceIdAncestorList: serviceIdAncestorListConcatFixture,
            },
            node: expectedGetInstanteDependenciesNode,
            taskKindType: TaskNodeExpandCommandType.getInstanceDependencies,
          };

        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(
          getInstanceDependenciesTraphGraphExpandCommand,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and context.serviceIdAncestorList returns false and bus.handle() returns a promise', () => {
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

        (
          busMock.handle as jestMock.Mock<
            (params: TaskNodeExpandCommand) => Promise<void>
          >
        ).mockResolvedValueOnce(undefined);

        try {
          createInstanceTaskGraphExpandCommandHandler.handle(
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

      it('should call context.serviceIdAncestorList.concat', () => {
        expect(serviceIdAncestorListMock.concat).toHaveBeenCalledTimes(1);
        expect(serviceIdAncestorListMock.concat).toHaveBeenCalledWith(
          nodeFixture.element.kind.binding.id,
        );
      });

      it('should call bus', () => {
        const getInstanceDependenciesTraphGraphExpandCommand: GetInstanceDependenciesTaskNodeExpandCommand =
          {
            context: {
              ...createInstanceTaskGraphExpandCommand.context,
              serviceIdAncestorList: serviceIdAncestorListConcatFixture,
            },
            node: expectedGetInstanteDependenciesNode,
            taskKindType: TaskNodeExpandCommandType.getInstanceDependencies,
          };

        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(
          getInstanceDependenciesTraphGraphExpandCommand,
        );
      });

      it('should throw an Error', () => {
        const expectedError: Partial<Error> = {
          message: 'Expecting a syncronous result',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(expect.objectContaining(expectedError));
      });
    });

    describe('when called, and context.serviceIdAncestorList returns true', () => {
      let result: unknown;

      beforeAll(() => {
        serviceIdAncestorListMock.includes.mockReturnValueOnce(true);
        serviceIdAncestorListMock[Symbol.iterator].mockReturnValueOnce({
          next: (): IteratorResult<ServiceId> => ({
            done: true,
            value: undefined,
          }),
        });

        try {
          createInstanceTaskGraphExpandCommandHandler.handle(
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
        const expectedError: Partial<Error> = {
          message: expect.stringContaining(
            'Circular dependency found related to',
          ) as unknown as string,
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(expect.objectContaining(expectedError));
      });
    });
  });

  describe('having a CreateInstanceTaskGraphExpandCommand with node with create instance task with value binging', () => {
    let classMetadataFixture: ClassMetadata;
    let createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand;
    let nodeFixture: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind<ValueBinding>>
    >;

    beforeAll(() => {
      classMetadataFixture = ClassMetadataFixtures.any;

      nodeFixture = {
        dependencies: undefined,
        element: {
          kind: CreateInstanceTaskKindFixtures.withBindingValue,
          perform: jest.fn(),
          result: undefined,
          status: cuaktask.TaskStatus.NotStarted,
        },
      };

      createInstanceTaskGraphExpandCommand = {
        context:
          {} as Partial<CreateInstanceTaskNodeExpandOperationContext> as CreateInstanceTaskNodeExpandOperationContext,
        node: nodeFixture,
        taskKindType: TaskNodeExpandCommandType.createInstance,
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

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
