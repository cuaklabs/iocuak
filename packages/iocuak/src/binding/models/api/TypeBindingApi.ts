import { Newable } from '../../../common/models/domain/Newable';
import { TaskScopeApi } from '../../../task/models/api/TaskScopeApi';
import { BaseBindingApi } from './BaseBindingApi';
import { BindingApiType } from './BindingApiType';

export interface TypeBindingApi<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBindingApi {
  bindingType: BindingApiType.type;
  scope: TaskScopeApi;
  type: Newable<TInstance, TArgs>;
}
