import { BaseDependentTask } from '@cuaklabs/cuaktask';

import { DependentTask } from '../../../../cuaktask/task/models/domain/DependentTask';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { Newable } from '../domain/Newable';
import { TaskId } from '../domain/TaskId';
import { TaskKind } from '../domain/TaskKind';
import { TaskScope } from '../domain/TaskScope';

export class CreateInstanceTask<
  TInstance,
  TArgs extends unknown[] = unknown[],
> extends BaseDependentTask<
  CreateInstanceTaskKind,
  TaskKind,
  TArgs,
  TInstance
> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #instanceConstructor: Newable<TInstance, TArgs>;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #taskIdToInstanceMap: Map<TaskId, unknown>;

  constructor(
    instanceConstructor: Newable<TInstance, TArgs>,
    taskIdToInstanceMap: Map<TaskId, unknown>,
    kind: CreateInstanceTaskKind,
    dependencies: DependentTask<TaskKind, TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#instanceConstructor = instanceConstructor;
    this.#taskIdToInstanceMap = taskIdToInstanceMap;
  }

  protected innerPerform(...args: TArgs): TInstance {
    let instance: TInstance;

    switch (this.kind.scope) {
      case TaskScope.singleton:
        instance = this.getInstanceInSingletonScope(...args);

        break;
      case TaskScope.transient:
        instance = this.getInstanceInTransientScope(...args);
        break;
    }

    return instance;
  }

  private getInstanceInSingletonScope(...args: TArgs): TInstance {
    const instanceFromMap: unknown = this.#taskIdToInstanceMap.get(
      this.kind.id,
    );

    let instance: TInstance;

    if (instanceFromMap === undefined) {
      instance = this.getInstanceInTransientScope(...args);

      this.#taskIdToInstanceMap.set(this.kind.id, instance);
    } else {
      instance = instanceFromMap as TInstance;
    }

    return instance;
  }

  private getInstanceInTransientScope(...args: TArgs): TInstance {
    return new this.#instanceConstructor(...args);
  }
}
