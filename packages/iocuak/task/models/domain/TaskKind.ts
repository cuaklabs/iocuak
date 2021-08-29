import { TaskId } from './TaskId';
import { TaskKindType } from './TaskKindType';
import { TaskScope } from './TaskScope';

export interface TaskKind<TTaskKindType extends TaskKindType = TaskKindType> {
  id: TaskId;
  type: TTaskKindType;
  scope: TaskScope;
}
