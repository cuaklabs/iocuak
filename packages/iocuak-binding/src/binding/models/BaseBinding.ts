import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

import { BindingType } from './BindingType';

export interface BaseBinding {
  id: ServiceId;
  bindingType: BindingType;
  tags: Tag[];
}
