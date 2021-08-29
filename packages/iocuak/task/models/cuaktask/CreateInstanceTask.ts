import { BaseDependentTask } from '@cuaklabs/cuaktask';

import { DependentTask } from '../../../../cuaktask/task/models/domain/DependentTask';
import { Newable } from '../domain/Newable';
import { TaskKind } from '../domain/TaskKind';
import { TaskKindType } from '../domain/TaskKindType';

export class CreateInstanceTask<
  TInstance,
  TArgs extends unknown[],
> extends BaseDependentTask<TaskKind, TArgs, TInstance> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #instanceConstructor: Newable<TInstance, TArgs>;

  constructor(
    instanceConstructor: Newable<TInstance, TArgs>,
    kind: TaskKind<TaskKindType.createInstance>,
    dependencies: DependentTask<TaskKind, TArgs, TInstance>[] = [],
  ) {
    super(kind, dependencies);

    this.#instanceConstructor = instanceConstructor;
  }

  protected innerPerform(...args: TArgs): TInstance {
    return new this.#instanceConstructor(...args);
  }
}
