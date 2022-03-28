import { Newable } from '../../../common/models/domain/Newable';
import { BaseBindingApi } from './BaseBindingApi';
import { BindingApiType } from './BindingApiType';
import { BindingScopeApi } from './BindingScopeApi';

export interface TypeBindingApi<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> extends BaseBindingApi {
  bindingType: BindingApiType.type;
  scope: BindingScopeApi;
  type: Newable<TInstance, TArgs>;
}
