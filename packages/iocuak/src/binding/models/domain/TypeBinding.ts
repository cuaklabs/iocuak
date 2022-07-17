import { Newable } from '@cuaklabs/iocuak-common';

import { BaseBinding } from './BaseBinding';
import { BindingScope } from './BindingScope';
import { BindingType } from './BindingType';

export interface TypeBinding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBinding {
  bindingType: BindingType.type;
  scope: BindingScope;
  type: Newable<TInstance, TArgs>;
}
