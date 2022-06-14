import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { CreateInstanceTaskLazyNode } from './CreateInstanceTaskLazyNode';

describe(CreateInstanceTaskLazyNode.name, () => {
  let busMock: jest.Mocked<
    Handler<
      TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >,
      void | Promise<void>
    >
  >;
  let context: CreateInstanceTaskGraphExpandOperationContext;
  let element: cuaktask.Task<TaskKind>;
  let taskKindType: TaskKindType;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };
    context = {
      _type: Symbol(),
    } as unknown as CreateInstanceTaskGraphExpandOperationContext;
    element = {
      _type: Symbol(),
    } as unknown as cuaktask.Task<TaskKind>;
    taskKindType = TaskKindType.createInstance;
  });

  describe('.dependencies', () => {
    describe('when called', () => {
      let createInstanceTaskLazyNode: CreateInstanceTaskLazyNode;

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
          cuaktask.Task<unknown>
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
      let createInstanceTaskLazyNode: CreateInstanceTaskLazyNode;

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
          cuaktask.Task<unknown>
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
