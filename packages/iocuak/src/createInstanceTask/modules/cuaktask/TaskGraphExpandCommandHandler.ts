import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class TaskGraphExpandCommandHandler
  implements Handler<TaskGraphExpandCommand, void>
{
  readonly #createInstanceTaskGraphExpandCommandHandler: Handler<
    CreateInstanceTaskGraphExpandCommand,
    void
  >;

  readonly #getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
    GetInstanceDependenciesTaskGraphExpandCommand,
    void
  >;

  constructor(
    createInstanceTaskGraphExpandCommandHandler: Handler<
      CreateInstanceTaskGraphExpandCommand,
      void
    >,
    getInstanceDependenciesTaskGraphExpandCommandHandler: Handler<
      GetInstanceDependenciesTaskGraphExpandCommand,
      void
    >,
  ) {
    this.#createInstanceTaskGraphExpandCommandHandler =
      createInstanceTaskGraphExpandCommandHandler;
    this.#getInstanceDependenciesTaskGraphExpandCommandHandler =
      getInstanceDependenciesTaskGraphExpandCommandHandler;
  }

  public handle(taskGraphExpandCommand: TaskGraphExpandCommand): void {
    switch (taskGraphExpandCommand.taskKindType) {
      case TaskKindType.createInstance:
        this.#createInstanceTaskGraphExpandCommandHandler.handle(
          taskGraphExpandCommand,
        );
        break;
      case TaskKindType.getInstanceDependencies:
        this.#getInstanceDependenciesTaskGraphExpandCommandHandler.handle(
          taskGraphExpandCommand,
        );
        break;
      default:
        throw new Error('Unexpected task graph expand command');
    }
  }
}
