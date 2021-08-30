import { TaskId } from '../task/models/domain/TaskId';

export function stringifyTaskId(id: TaskId): string {
  switch (typeof id) {
    case 'string':
    case 'symbol':
      return id.toString();
    case 'function':
      return id.name;
    default:
      throw new Error(`Unexpected ${typeof id} task id type`);
  }
}
