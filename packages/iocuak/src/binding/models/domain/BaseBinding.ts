import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingTag } from './BindingTag';
import { BindingType } from './BindingType';

export interface BaseBinding {
  id: ServiceId;
  bindingType: BindingType;
  tags: BindingTag[];
}
