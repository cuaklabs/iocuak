import { BindingScope } from '@cuaklabs/iocuak-binding';

import { BindingScopeApi } from './BindingScopeApi';

export const bindingScopeToBindingScopeApiMap: {
  [TKey in BindingScope]: BindingScopeApi;
} = {
  [BindingScope.request]: BindingScopeApi.request,
  [BindingScope.singleton]: BindingScopeApi.singleton,
  [BindingScope.transient]: BindingScopeApi.transient,
};
