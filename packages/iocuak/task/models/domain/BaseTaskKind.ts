import { TaskId } from './TaskId';
import { TaskKindType } from './TaskKindType';

export interface BaseTaskKind<
  TTaskKindType extends TaskKindType = TaskKindType,
> {
  id: TaskId;
  type: TTaskKindType;
}
