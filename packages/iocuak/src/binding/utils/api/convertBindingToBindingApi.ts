import {
  Binding,
  BindingType,
  TypeBinding,
  ValueBinding,
} from '@cuaklabs/iocuak-binding';

import { BindingApi } from '../../models/api/BindingApi';
import { bindingScopeToBindingScopeApiMap } from '../../models/api/bindingScopeToBindingScopeApiMap';
import { BindingTypeApi } from '../../models/api/BindingTypeApi';
import { TypeBindingApi } from '../../models/api/TypeBindingApi';
import { ValueBindingApi } from '../../models/api/ValueBindingApi';

export function convertBindingToBindingApi<TInstance, TArgs extends unknown[]>(
  binding: TypeBinding<TInstance, TArgs>,
): TypeBindingApi<TInstance, TArgs>;
export function convertBindingToBindingApi<TInstance>(
  binding: ValueBinding<TInstance>,
): ValueBindingApi<TInstance>;
export function convertBindingToBindingApi<TInstance, TArgs extends unknown[]>(
  binding: Binding<TInstance, TArgs>,
): BindingApi<TInstance, TArgs>;
export function convertBindingToBindingApi<TInstance, TArgs extends unknown[]>(
  binding: Binding<TInstance, TArgs>,
): BindingApi<TInstance, TArgs> {
  let bindingApi: BindingApi<TInstance, TArgs>;

  switch (binding.bindingType) {
    case BindingType.type:
      bindingApi = {
        bindingType: BindingTypeApi.type,
        id: binding.id,
        scope: bindingScopeToBindingScopeApiMap[binding.scope],
        tags: [...binding.tags],
        type: binding.type,
      };
      break;
    case BindingType.value:
      bindingApi = {
        bindingType: BindingTypeApi.value,
        id: binding.id,
        tags: [...binding.tags],
        value: binding.value,
      };
      break;
  }

  return bindingApi;
}
