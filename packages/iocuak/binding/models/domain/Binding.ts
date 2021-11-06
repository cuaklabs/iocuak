import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskScope } from '../../../task/models/domain/TaskScope';

export interface Binding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> {
  id: ServiceId;
  scope: TaskScope;
  type: Newable<TInstance, TArgs>;
}
