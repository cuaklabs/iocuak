import { Task } from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskLazyNode } from './CreateInstanceTaskLazyNode';

describe(CreateInstanceTaskLazyNode.name, () => {
  let busMock: jest.Mocked<
    Handler<
      TaskGraphExpandCommand<
        TaskGraphExpandOperationContext,
        unknown,
        Task<unknown>
      >,
      void | Promise<void>
    >
  >;
  let context: TaskGraphExpandOperationContext;
  let element: Task<unknown>;
  let taskKindType: unknown;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };
    context = {
      _type: Symbol(),
    } as unknown as TaskGraphExpandOperationContext;
    element = {
      _type: Symbol(),
    } as unknown as Task<unknown>;
    taskKindType = Symbol();
  });

  describe('.dependencies', () => {
    describe('when called', () => {
      let createInstanceTaskLazyNode: CreateInstanceTaskLazyNode<
        TaskGraphExpandOperationContext,
        Task<unknown>
      >;

      let result: unknown;

      beforeAll(() => {
        createInstanceTaskLazyNode = new CreateInstanceTaskLazyNode(
          busMock,
          context,
          element,
          taskKindType,
        );

        result = createInstanceTaskLazyNode.dependencies;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bus.handle()', () => {
        const command: TaskGraphExpandCommand<
          TaskGraphExpandOperationContext,
          unknown,
          Task<unknown>
        > = {
          context: context,
          node: createInstanceTaskLazyNode,
          taskKindType: taskKindType,
        };

        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(command);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called twice', () => {
      let createInstanceTaskLazyNode: CreateInstanceTaskLazyNode<
        TaskGraphExpandOperationContext,
        Task<unknown>
      >;

      let result: unknown;

      beforeAll(() => {
        createInstanceTaskLazyNode = new CreateInstanceTaskLazyNode(
          busMock,
          context,
          element,
          taskKindType,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        createInstanceTaskLazyNode.dependencies;

        result = createInstanceTaskLazyNode.dependencies;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bus.handle()', () => {
        const command: TaskGraphExpandCommand<
          TaskGraphExpandOperationContext,
          unknown,
          Task<unknown>
        > = {
          context: context,
          node: createInstanceTaskLazyNode,
          taskKindType: taskKindType,
        };

        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(command);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
