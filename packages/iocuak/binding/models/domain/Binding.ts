import { Newable } from '../../../task/models/domain/Newable';
import { TaskId } from '../../../task/models/domain/TaskId';
import { TaskScope } from '../../../task/models/domain/TaskScope';

export interface Binding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> {
  id: TaskId;
  scope: TaskScope;
  type: Newable<TInstance, TArgs>;
}
