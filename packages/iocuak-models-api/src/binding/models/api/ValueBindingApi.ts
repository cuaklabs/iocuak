import { BaseBindingApi } from './BaseBindingApi';
import { BindingTypeApi } from './BindingTypeApi';

export interface ValueBindingApi<TInstance = unknown> extends BaseBindingApi {
  bindingType: BindingTypeApi.value;
  value: TInstance;
}
