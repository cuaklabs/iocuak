import {
  isPromiseLike,
  Node,
  NodeDependencies,
  Task,
} from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { Handler } from '../../../common/modules/domain/Handler';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskLazyNode implements Node<Task<TaskKind>> {
  readonly #bus: Handler<unknown, void | Promise<void>>;
  readonly #context: TaskGraphExpandOperationContext;
  readonly #taskKindType: TaskKindType;

  #dependencies: NodeDependencies<Task<TaskKind>> | undefined;
  #isLoaded: boolean;

  constructor(
    bus: Handler<
      TaskGraphExpandCommand<
        TaskGraphExpandOperationContext,
        TaskKindType,
        Task<TaskKind>
      >,
      void | Promise<void>
    >,
    context: TaskGraphExpandOperationContext,
    public readonly element: Task<TaskKind>,
    taskKindType: TaskKindType,
  ) {
    this.#bus = bus;
    this.#context = context;
    this.#dependencies = undefined;
    this.#isLoaded = false;
    this.#taskKindType = taskKindType;
  }

  public get dependencies(): NodeDependencies<Task<TaskKind>> | undefined {
    if (!this.#isLoaded) {
      const command: TaskGraphExpandCommand<
        TaskGraphExpandOperationContext,
        TaskKindType,
        Task<TaskKind>
      > = {
        context: this.#context,
        node: this,
        taskKindType: this.#taskKindType,
      };

      const result: void | Promise<void> = this.#bus.handle(command);

      if (isPromiseLike(result)) {
        throw new Error('Expected a sync handler response');
      } else {
        this.#isLoaded = true;
      }
    }

    return this.#dependencies;
  }

  public set dependencies(value: NodeDependencies<Task<TaskKind>> | undefined) {
    this.#dependencies = value;
  }
}
