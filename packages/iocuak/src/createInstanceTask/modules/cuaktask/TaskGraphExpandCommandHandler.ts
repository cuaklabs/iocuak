import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';

export class TaskGraphExpandCommandHandler
  implements Handler<TaskGraphExpandCommand, void>
{
  readonly #taskGraphExpandCommandTypeToHandlerMap: Map<
    TaskGraphExpandCommandType,
    Handler<CreateInstanceTaskGraphExpandCommand, void>
  >;

  constructor() {
    this.#taskGraphExpandCommandTypeToHandlerMap = new Map();
  }

  public handle(taskGraphExpandCommand: TaskGraphExpandCommand): void {
    const handler: Handler<TaskGraphExpandCommand, void> | undefined =
      this.#taskGraphExpandCommandTypeToHandlerMap.get(
        taskGraphExpandCommand.taskKindType,
      );

    if (handler === undefined) {
      throw new Error('Unexpected task graph expand command');
    } else {
      handler.handle(taskGraphExpandCommand);
    }
  }

  public register(
    type: TaskGraphExpandCommandType,
    handler: Handler<TaskGraphExpandCommand, void>,
  ): void {
    this.#taskGraphExpandCommandTypeToHandlerMap.set(type, handler);
  }
}
