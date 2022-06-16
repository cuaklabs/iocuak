import * as cuaktask from '@cuaklabs/cuaktask';

import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class TaskGraphExpandCommandHandler
  implements
    Handler<
      TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >,
      void
    >
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

  public handle(
    taskGraphExpandCommand: TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
  ): void {
    switch (taskGraphExpandCommand.taskKindType) {
      case TaskKindType.createInstance:
        this.#handleCreateInstanceGraphExpandCommand(taskGraphExpandCommand);
        break;
      case TaskKindType.getInstanceDependencies:
        this.#handleGetInstanceDependenciesGraphExpandCommand(
          taskGraphExpandCommand,
        );
        break;
      default:
        throw new Error('Unexpected task graph expand command');
    }
  }

  #isCreateInstanceTaskGraphExpandCommand(
    command: TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
  ): command is CreateInstanceTaskGraphExpandCommand {
    return (
      command.taskKindType == TaskKindType.createInstance &&
      (command.node.element.kind as TaskKind).type ===
        TaskKindType.createInstance
    );
  }

  #isGetInstanceDependenciesTaskGraphExpandCommand(
    command: TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
  ): command is GetInstanceDependenciesTaskGraphExpandCommand {
    return (
      command.taskKindType == TaskKindType.getInstanceDependencies &&
      (command.node.element.kind as TaskKind).type ===
        TaskKindType.getInstanceDependencies
    );
  }

  #handleCreateInstanceGraphExpandCommand(
    command: TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
  ): void {
    if (this.#isCreateInstanceTaskGraphExpandCommand(command)) {
      this.#createInstanceTaskGraphExpandCommandHandler.handle(command);
    } else {
      throw new Error('Invalid createInstance task graph command');
    }
  }

  #handleGetInstanceDependenciesGraphExpandCommand(
    command: TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
  ): void {
    if (this.#isGetInstanceDependenciesTaskGraphExpandCommand(command)) {
      this.#getInstanceDependenciesTaskGraphExpandCommandHandler.handle(
        command,
      );
    } else {
      throw new Error('Invalid getInstanceDependencies task graph command');
    }
  }
}
