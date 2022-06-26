import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';

export class TaskNodeExpandCommandHandler
  implements Handler<TaskNodeExpandCommand, void>
{
  readonly #taskGraphExpandCommandTypeToHandlerMap: Map<
    TaskNodeExpandCommandType,
    Handler<CreateInstanceTaskNodeExpandCommand, void>
  >;

  constructor() {
    this.#taskGraphExpandCommandTypeToHandlerMap = new Map();
  }

  public handle(taskGraphExpandCommand: TaskNodeExpandCommand): void {
    const handler: Handler<TaskNodeExpandCommand, void> | undefined =
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
    type: TaskNodeExpandCommandType,
    handler: Handler<TaskNodeExpandCommand, void>,
  ): void {
    this.#taskGraphExpandCommandTypeToHandlerMap.set(type, handler);
  }
}
