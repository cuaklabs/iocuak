import { BaseBinding } from './BaseBinding';
import { BindingType } from './BindingType';

export interface ValueBinding<TInstance = unknown> extends BaseBinding {
  bindingType: BindingType.value;
  value: TInstance;
}
