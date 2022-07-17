import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

import { BindingScopeApi } from './BindingScopeApi';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: BindingScopeApi;
  tags?: Tag | Tag[];
}
