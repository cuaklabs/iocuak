import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
import { TaskGraphExpandCommandHandler } from './TaskGraphExpandCommandHandler';

describe(TaskGraphExpandCommandHandler.name, () => {
  describe('.handle', () => {
    describe('having a task graph expand command and a registered handler', () => {
      let handlerMock: jest.Mocked<
        Handler<CreateInstanceTaskGraphExpandCommand, void>
      >;
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand;

      beforeAll(() => {
        handlerMock = {
          handle: jest.fn(),
        };

        taskGraphExpandCommandFixture = {
          taskKindType: TaskGraphExpandCommandType.createInstance,
        } as Partial<TaskGraphExpandCommand> as TaskGraphExpandCommand;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let taskGraphExpandCommandHandler: TaskGraphExpandCommandHandler;

        let result: unknown;

        beforeAll(() => {
          taskGraphExpandCommandHandler = new TaskGraphExpandCommandHandler();

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
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          taskKindType: TaskGraphExpandCommandType.getInstanceDependencies,
        } as Partial<TaskGraphExpandCommand> as TaskGraphExpandCommand;
      });

      describe('when called', () => {
        let taskGraphExpandCommandHandler: TaskGraphExpandCommandHandler;

        let result: unknown;

        beforeAll(() => {
          taskGraphExpandCommandHandler = new TaskGraphExpandCommandHandler();

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
