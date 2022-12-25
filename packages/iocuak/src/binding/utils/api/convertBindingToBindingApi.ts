import {
  Binding,
  BindingType,
  TypeBinding,
  ValueBinding,
} from '@cuaklabs/iocuak-models';
import {
  BindingApi,
  bindingScopeToBindingScopeApiMap,
  BindingTypeApi,
  TypeBindingApi,
  ValueBindingApi,
} from '@cuaklabs/iocuak-models-api';

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
