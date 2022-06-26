import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { TaskNodeExpandCommandHandler } from './TaskNodeExpandCommandHandler';

describe(TaskNodeExpandCommandHandler.name, () => {
  describe('.handle', () => {
    describe('having a task graph expand command and a registered handler', () => {
      let handlerMock: jest.Mocked<
        Handler<CreateInstanceTaskNodeExpandCommand, void>
      >;
      let taskGraphExpandCommandFixture: TaskNodeExpandCommand;

      beforeAll(() => {
        handlerMock = {
          handle: jest.fn(),
        };

        taskGraphExpandCommandFixture = {
          taskKindType: TaskNodeExpandCommandType.createInstance,
        } as Partial<TaskNodeExpandCommand> as TaskNodeExpandCommand;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let taskGraphExpandCommandHandler: TaskNodeExpandCommandHandler;

        let result: unknown;

        beforeAll(() => {
          taskGraphExpandCommandHandler = new TaskNodeExpandCommandHandler();

          taskGraphExpandCommandHandler.register(
            taskGraphExpandCommandFixture.taskKindType,
            handlerMock,
          );

          result = taskGraphExpandCommandHandler.handle(
            taskGraphExpandCommandFixture,
          );
        });

        it('should call createInstanceTaskGraphExpandCommandHandler.handle()', () => {
          expect(handlerMock.handle).toHaveBeenCalledTimes(1);
          expect(handlerMock.handle).toHaveBeenCalledWith(
            taskGraphExpandCommandFixture,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskNodeExpandCommand;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          taskKindType: TaskNodeExpandCommandType.getInstanceDependencies,
        } as Partial<TaskNodeExpandCommand> as TaskNodeExpandCommand;
      });

      describe('when called', () => {
        let taskGraphExpandCommandHandler: TaskNodeExpandCommandHandler;

        let result: unknown;

        beforeAll(() => {
          taskGraphExpandCommandHandler = new TaskNodeExpandCommandHandler();

          try {
            taskGraphExpandCommandHandler.handle(taskGraphExpandCommandFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an Error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unexpected task graph expand command',
            }),
          );
        });
      });
    });
  });
});
