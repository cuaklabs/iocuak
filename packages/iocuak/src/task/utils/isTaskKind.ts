import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

export function isTaskKind(value: unknown): value is TaskKind {
  const taskKind: TaskKind = value as TaskKind;

  return Object.values(TaskKindType).includes(taskKind.type);
}
