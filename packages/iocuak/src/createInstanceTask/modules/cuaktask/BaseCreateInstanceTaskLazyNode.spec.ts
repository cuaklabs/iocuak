import { Handler } from '../../../common/modules/domain/Handler';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
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
    Handler<TaskGraphExpandCommand, void | Promise<void>>
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
