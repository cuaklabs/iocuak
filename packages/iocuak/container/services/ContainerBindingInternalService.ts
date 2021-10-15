import { Binding } from '../../binding/models/domain/Binding';
import { TaskId } from '../../task/models/domain/TaskId';

export interface ContainerBindingInternalService {
  get(taskId: TaskId): Binding | undefined;
}
