import { TaskKind } from './TaskKind';
import { TaskKindType } from './TaskKindType';
import { TaskScope } from './TaskScope';

export interface CreateInstanceTaskKind
  extends TaskKind<TaskKindType.createInstance> {
  scope: TaskScope;
}
