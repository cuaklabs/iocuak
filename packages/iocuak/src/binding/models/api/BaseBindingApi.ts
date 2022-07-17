import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingTag } from '../domain/BindingTag';
import { BindingTypeApi } from './BindingTypeApi';

export interface BaseBindingApi {
  id: ServiceId;
  bindingType: BindingTypeApi;
  tags: BindingTag[];
}
