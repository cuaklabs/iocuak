import { TaskKind } from '../task/models/domain/TaskKind';
import { TaskKindType } from '../task/models/domain/TaskKindType';

export function isTaskKind(value: unknown): value is TaskKind {
  const taskKind: TaskKind = value as TaskKind;

  return Object.values(TaskKindType).includes(taskKind.type);
}
