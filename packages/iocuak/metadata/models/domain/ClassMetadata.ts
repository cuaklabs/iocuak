import { TaskId } from '../../../task/models/domain/TaskId';

export interface ClassMetadata {
  constructorArguments: TaskId[];
  properties: Record<string, TaskId>;
}
