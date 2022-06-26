import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { Handler } from '../../../common/modules/domain/Handler';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { BaseCreateInstanceTaskLazyNode } from './BaseCreateInstanceTaskLazyNode';

class BaseCreateInstanceTaskLazyNodeMock extends BaseCreateInstanceTaskLazyNode {
  constructor(
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    public taskGraphExpandCommandFixture: TaskNodeExpandCommand,
  ) {
    super(bus);
  }

  protected buildTaskGraphExpandCommand(): TaskNodeExpandCommand {
    return this.taskGraphExpandCommandFixture;
  }
}

describe(BaseCreateInstanceTaskLazyNode.name, () => {
  let busMock: jestMock.Mocked<
    Handler<TaskNodeExpandCommand, void | Promise<void>>
  >;
  let taskGraphExpandCommandFixture: TaskNodeExpandCommand;

  beforeAll(() => {
    busMock = {
      handle: jest.fn(),
    };
    taskGraphExpandCommandFixture = {
      _type: Symbol(),
    } as unknown as TaskNodeExpandCommand;
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
