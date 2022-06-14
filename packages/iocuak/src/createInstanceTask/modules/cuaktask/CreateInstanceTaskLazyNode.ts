import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskLazyNode
  implements cuaktask.Node<cuaktask.Task<TaskKind>>
{
  readonly #bus: Handler<
    TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
    void | Promise<void>
  >;
  readonly #context: CreateInstanceTaskGraphExpandOperationContext;
  readonly #taskKindType: TaskKindType;

  #dependencies: cuaktask.NodeDependencies<cuaktask.Task<TaskKind>> | undefined;
  #isLoaded: boolean;

  constructor(
    bus: Handler<
      TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >,
      void | Promise<void>
    >,
    context: CreateInstanceTaskGraphExpandOperationContext,
    public readonly element: cuaktask.Task<TaskKind>,
    taskKindType: TaskKindType,
  ) {
    this.#bus = bus;
    this.#context = context;
    this.#dependencies = undefined;
    this.#isLoaded = false;
    this.#taskKindType = taskKindType;
  }

  public get dependencies():
    | cuaktask.NodeDependencies<cuaktask.Task<TaskKind>>
    | undefined {
    if (!this.#isLoaded) {
      const command: TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      > = {
        context: this.#context,
        node: this,
        taskKindType: this.#taskKindType,
      };

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
}
