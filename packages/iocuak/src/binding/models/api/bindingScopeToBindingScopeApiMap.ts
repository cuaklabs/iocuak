import { BindingScope } from '@cuaklabs/iocuak-models';
import { BindingScopeApi } from '@cuaklabs/iocuak-models-api';

export const bindingScopeToBindingScopeApiMap: {
  [TKey in BindingScope]: BindingScopeApi;
} = {
  [BindingScope.request]: BindingScopeApi.request,
  [BindingScope.singleton]: BindingScopeApi.singleton,
  [BindingScope.transient]: BindingScopeApi.transient,
};
