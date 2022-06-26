import * as cuaktask from '@cuaklabs/cuaktask';

import { Handler } from '../../../common/modules/domain/Handler';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskKind } from '../../models/domain/TaskKind';

export abstract class BaseCreateInstanceTaskLazyNode {
  readonly #bus: Handler<TaskNodeExpandCommand, void | Promise<void>>;

  #dependencies: cuaktask.NodeDependencies<cuaktask.Task<TaskKind>> | undefined;
  #isLoaded: boolean;

  constructor(bus: Handler<TaskNodeExpandCommand, void | Promise<void>>) {
    this.#bus = bus;
    this.#dependencies = undefined;
    this.#isLoaded = false;
  }

  public get dependencies():
    | cuaktask.NodeDependencies<cuaktask.Task<TaskKind>>
    | undefined {
    if (!this.#isLoaded) {
      const command: TaskNodeExpandCommand = this.buildTaskGraphExpandCommand();

      const result: void | Promise<void> = this.#bus.handle(command);

      if (cuaktask.isPromiseLike(result)) {
        throw new Error('Expected a sync handler response');
      } else {
        this.#isLoaded = true;
      }
    }

    return this.#dependencies;
  }

  public set dependencies(
    value: cuaktask.NodeDependencies<cuaktask.Task<TaskKind>> | undefined,
  ) {
    this.#dependencies = value;
  }

  protected abstract buildTaskGraphExpandCommand(): TaskNodeExpandCommand;
}
