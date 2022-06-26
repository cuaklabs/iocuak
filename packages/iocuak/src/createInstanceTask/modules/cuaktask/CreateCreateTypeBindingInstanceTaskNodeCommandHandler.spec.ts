import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateCreateTypeBindingInstanceTaskNodeCommandHandler } from './CreateCreateTypeBindingInstanceTaskNodeCommandHandler';

describe(CreateCreateTypeBindingInstanceTaskNodeCommandHandler.name, () => {
  let createCreateRequestScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createCreateSingletonScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;
  let createCreateTransientScopedInstanceTaskGraphNodeCommandHandlerMock: jest.Mocked<
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
  >;

  let createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: CreateCreateTypeBindingInstanceTaskNodeCommandHandler;

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

    createCreateTypeBindingInstanceTaskGraphNodeCommandHandler =
      new CreateCreateTypeBindingInstanceTaskNodeCommandHandler(
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
            CreateCreateTypeBindingInstanceTaskNodeCommand,
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
            CreateCreateTypeBindingInstanceTaskNodeCommand,
            cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
          >
        >,
      ) => {
        let createCreateInstanceTaskGraphNodeCommandFixture: CreateCreateTypeBindingInstanceTaskNodeCommand;

        beforeAll(() => {
          const requestId: symbol = Symbol();

          createCreateInstanceTaskGraphNodeCommandFixture = {
            context: {
              requestId: requestId,
              serviceIdAncestorList: {
                _type: Symbol(),
              } as unknown as ReadOnlyLinkedList<ServiceId>,
              serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
              serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
              taskKind: {
                binding: typeBinding,
                requestId: requestId,
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

            result =
              createCreateTypeBindingInstanceTaskGraphNodeCommandHandler.handle(
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
