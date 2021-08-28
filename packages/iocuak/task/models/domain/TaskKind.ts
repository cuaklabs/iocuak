import { TaskId } from './TaskId';
import { TaskKindType } from './TaskKindType';
import { TaskScope } from './TaskScope';

export interface TaskKind {
  id: TaskId;
  type: TaskKindType;
  scope: TaskScope;
}
