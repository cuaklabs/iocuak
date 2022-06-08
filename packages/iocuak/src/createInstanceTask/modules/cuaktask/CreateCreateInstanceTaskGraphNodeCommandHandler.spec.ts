import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateCreateInstanceTaskGraphNodeCommandHandler } from './CreateCreateInstanceTaskGraphNodeCommandHandler';

describe(CreateCreateInstanceTaskGraphNodeCommandHandler.name, () => {
  let createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;

  let createCreateInstanceTaskGraphNodeCommandHandler: CreateCreateInstanceTaskGraphNodeCommandHandler;

  beforeAll(() => {
    createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };
    createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };
    createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };

    createCreateInstanceTaskGraphNodeCommandHandler =
      new CreateCreateInstanceTaskGraphNodeCommandHandler(
        createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerMock,
        createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerMock,
        createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerMock,
      );
  });

  describe('.handle', () => {
    describe.each<
      [
        string,
        TypeBinding,
        () => jest.Mocked<
          Handler<
            CreateCreateInstanceTaskGraphNodeCommand,
            cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
          >
        >,
      ]
    >([
      [
        'request',
        TypeBindingFixtures.withScopeRequest,
        () => createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerMock,
      ],
      [
        'singleton',
        TypeBindingFixtures.withScopeSingleton,
        () =>
          createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerMock,
      ],
      [
        'transient',
        TypeBindingFixtures.withScopeTransient,
        () =>
          createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerMock,
      ],
    ])(
      'having a createCreateInstanceTaskGraphNodeCommand with context with type binding with scope %s',
      (
        _: string,
        typeBinding: TypeBinding,
        handlerMockFn: () => jest.Mocked<
          Handler<
            CreateCreateInstanceTaskGraphNodeCommand,
            cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
          >
        >,
      ) => {
        let createCreateInstanceTaskGraphNodeCommandFixture: CreateCreateInstanceTaskGraphNodeCommand;

        beforeAll(() => {
          createCreateInstanceTaskGraphNodeCommandFixture = {
            context: {
              graph: {
                nodes: [],
              },
              serviceIdAncestorList: {
                _type: Symbol(),
              } as unknown as ReadOnlyLinkedList<ServiceId>,
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              taskKind: {
                binding: typeBinding,
                requestId: Symbol(),
                type: TaskKindType.createInstance,
              },
            },
          };
        });

        describe('when called', () => {
          let nodeDependencyFixture: cuaktask.NodeDependency<
            cuaktask.Task<TaskKind>
          >;
          let result: unknown;

          beforeAll(() => {
            nodeDependencyFixture = {
              _type: Symbol(),
            } as unknown as cuaktask.NodeDependency<cuaktask.Task<TaskKind>>;

            handlerMockFn().handle.mockReturnValueOnce(nodeDependencyFixture);

            result = createCreateInstanceTaskGraphNodeCommandHandler.handle(
              createCreateInstanceTaskGraphNodeCommandFixture,
            );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call handlerMock.handle()', () => {
            expect(handlerMockFn().handle).toHaveBeenCalledTimes(1);
            expect(handlerMockFn().handle).toHaveBeenCalledWith(
              createCreateInstanceTaskGraphNodeCommandFixture,
            );
          });

          it('should return nodeDependencyFixture', () => {
            expect(result).toStrictEqual(nodeDependencyFixture);
          });
        });
      },
    );
  });
});
