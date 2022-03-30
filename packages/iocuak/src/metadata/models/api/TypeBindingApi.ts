import { Newable } from '../../../common/models/domain/Newable';
import { BaseBindingApi } from './BaseBindingApi';
import { BindingScopeApi } from './BindingScopeApi';
import { BindingTypeApi } from './BindingTypeApi';

export interface TypeBindingApi<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBindingApi {
  bindingType: BindingTypeApi.type;
  scope: BindingScopeApi;
  type: Newable<TInstance, TArgs>;
}
