import { BaseDependentTask, DependentTask } from '@cuaklabs/cuaktask';

import { CreateArrayTaskKind } from '../domain/CreateArrayTaskKind';
import { TaskKind } from '../domain/TaskKind';

export class CreateArrayTask<TInstance = unknown> extends BaseDependentTask<
  CreateArrayTaskKind,
  TaskKind,
  TInstance[],
  TInstance[]
> {
  constructor(
    kind: CreateArrayTaskKind,
    dependencies: DependentTask<
      TaskKind,
      TaskKind,
      unknown[],
      TInstance
    >[] = [],
  ) {
    super(kind, dependencies);
  }

  protected innerPerform(...instances: TInstance[]): TInstance[] {
    return instances;
  }
}
