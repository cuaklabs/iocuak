import { TaskId } from '../../task/models/domain/TaskId';

export interface ContainerSingletonInternalService {
  get<TInstance>(taskId: TaskId): TInstance | undefined;
}
