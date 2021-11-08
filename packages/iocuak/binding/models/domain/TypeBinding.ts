import { Newable } from '../../../common/models/domain/Newable';
import { TaskScope } from '../../../task/models/domain/TaskScope';
import { BaseBinding } from './BaseBinding';
import { BindingType } from './BindingType';

export interface TypeBinding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBinding {
  bindingType: BindingType.type;
  scope: TaskScope;
  type: Newable<TInstance, TArgs>;
}
