import { taskScopeToTaskScopeApiMap } from '../../../task/models/api/taskScopeToTaskScopeApiMap';
import { BindingApi } from '../../models/api/BindingApi';
import { BindingApiType } from '../../models/api/BindingApiType';
import { TypeBindingApi } from '../../models/api/TypeBindingApi';
import { ValueBindingApi } from '../../models/api/ValueBindingApi';
import { Binding } from '../../models/domain/Binding';
import { BindingType } from '../../models/domain/BindingType';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { ValueBinding } from '../../models/domain/ValueBinding';

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
        bindingType: BindingApiType.type,
        id: binding.id,
        scope: taskScopeToTaskScopeApiMap[binding.scope],
        type: binding.type,
      };
      break;
    case BindingType.value:
      bindingApi = {
        bindingType: BindingApiType.value,
        id: binding.id,
        value: binding.value,
      };
      break;
  }

  return bindingApi;
}
