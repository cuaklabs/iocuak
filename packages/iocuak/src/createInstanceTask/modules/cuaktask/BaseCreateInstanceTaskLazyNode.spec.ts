import * as cuaktask from '@cuaklabs/cuaktask';

import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandBase } from '../../models/cuaktask/TaskGraphExpandCommandBase';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { BaseCreateInstanceTaskLazyNode } from './BaseCreateInstanceTaskLazyNode';

class BaseCreateInstanceTaskLazyNodeMock extends BaseCreateInstanceTaskLazyNode {
  constructor(
    bus: Handler<TaskGraphExpandCommand, void | Promise<void>>,
    public taskGraphExpandCommandFixture: TaskGraphExpandCommand,
  ) {
    super(bus);
  }

  protected buildTaskGraphExpandCommand(): TaskGraphExpandCommand {
    return this.taskGraphExpandCommandFixture;
  }
}

describe(BaseCreateInstanceTaskLazyNode.name, () => {
  let busMock: jest.Mocked<
    Handler<
      TaskGraphExpandCommandBase<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >,
      void | Promise<void>
    >
  >;
  let taskGraphExpandCommandFixture: TaskGraphExpandCommand;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };
    taskGraphExpandCommandFixture = {
      _type: Symbol(),
    } as unknown as TaskGraphExpandCommand;
  });

  describe('.dependencies', () => {
    describe('when called', () => {
      let createInstanceTaskLazyNode: BaseCreateInstanceTaskLazyNode;

      let result: unknown;

      beforeAll(() => {
        createInstanceTaskLazyNode = new BaseCreateInstanceTaskLazyNodeMock(
          busMock,
          taskGraphExpandCommandFixture,
        );

        result = createInstanceTaskLazyNode.dependencies;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bus.handle()', () => {
        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(
          taskGraphExpandCommandFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called twice', () => {
      let createInstanceTaskLazyNode: BaseCreateInstanceTaskLazyNode;

      let result: unknown;

      beforeAll(() => {
        createInstanceTaskLazyNode = new BaseCreateInstanceTaskLazyNodeMock(
          busMock,
          taskGraphExpandCommandFixture,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        createInstanceTaskLazyNode.dependencies;

        result = createInstanceTaskLazyNode.dependencies;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bus.handle()', () => {
        expect(busMock.handle).toHaveBeenCalledTimes(1);
        expect(busMock.handle).toHaveBeenCalledWith(
          taskGraphExpandCommandFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
