import {
  isPromiseLike,
  Node,
  NodeDependencies,
  Task,
} from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { Handler } from '../../../common/modules/domain/Handler';

export class CreateInstanceTaskLazyNode<
  TContext extends TaskGraphExpandOperationContext,
  TElem extends Task<unknown>,
  TTaskKindType = unknown,
> implements Node<TElem, Task<unknown>>
{
  readonly #bus: Handler<unknown, void | Promise<void>>;
  readonly #context: TContext;
  readonly #taskKindType: TTaskKindType;

  #dependencies: NodeDependencies<Task<unknown>> | undefined;
  #isLoaded: boolean;

  constructor(
    bus: Handler<
      TaskGraphExpandCommand<TContext, TTaskKindType, TElem>,
      void | Promise<void>
    >,
    context: TContext,
    public readonly element: TElem,
    taskKindType: TTaskKindType,
  ) {
    this.#bus = bus;
    this.#context = context;
    this.#isLoaded = false;
    this.#taskKindType = taskKindType;
  }

  public get dependencies(): NodeDependencies<Task<unknown>> | undefined {
    if (!this.#isLoaded) {
      const command: TaskGraphExpandCommand<TContext, TTaskKindType, TElem> = {
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

  public set dependencies(value: NodeDependencies<Task<unknown>> | undefined) {
    this.#dependencies = value;
  }
}
