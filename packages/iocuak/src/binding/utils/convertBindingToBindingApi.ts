import { taskScopeToTaskScopeApiMap } from '../../task/models/api/taskScopeToTaskScopeApiMap';
import { BindingApi } from '../models/api/BindingApi';
import { BindingApiType } from '../models/api/BindingApiType';
import { Binding } from '../models/domain/Binding';
import { BindingType } from '../models/domain/BindingType';

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
