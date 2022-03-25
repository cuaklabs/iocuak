import { BaseBindingApi } from './BaseBindingApi';
import { BindingApiType } from './BindingApiType';

export interface ValueBindingApi<TInstance = unknown> extends BaseBindingApi {
  bindingType: BindingApiType.value;
  value: TInstance;
}
