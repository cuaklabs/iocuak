import { BaseTaskKind } from './BaseTaskKind';
import { TaskKindType } from './TaskKindType';
import { TaskScope } from './TaskScope';

export interface CreateInstanceTaskKind
  extends BaseTaskKind<TaskKindType.createInstance> {
  scope: TaskScope;
}
