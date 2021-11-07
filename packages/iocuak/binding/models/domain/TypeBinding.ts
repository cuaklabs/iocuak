import { Newable } from '../../../common/models/domain/Newable';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { BaseBinding } from './BaseBinding';

export interface TypeBinding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBinding {
  scope: TaskScope;
  type: Newable<TInstance, TArgs>;
}
