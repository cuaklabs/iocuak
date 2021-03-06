import { BindingScope } from '@cuaklabs/iocuak-models';

import { BindingScopeApi } from './BindingScopeApi';

export const bindingScopeApiToBindingScopeMap: {
  [TKey in BindingScopeApi]: BindingScope;
} = {
  [BindingScopeApi.request]: BindingScope.request,
  [BindingScopeApi.singleton]: BindingScope.singleton,
  [BindingScopeApi.transient]: BindingScope.transient,
};
