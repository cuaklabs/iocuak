import { ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { BindingScopeApi } from '@cuaklabs/iocuak-models-api';

export interface InjectableOptionsApi {
  id?: ServiceId;
  scope?: BindingScopeApi;
  tags?: Tag | Tag[];
}
