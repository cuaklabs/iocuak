import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

import { BindingTypeApi } from './BindingTypeApi';

export interface BaseBindingApi {
  id: ServiceId;
  bindingType: BindingTypeApi;
  tags: Tag[];
}
