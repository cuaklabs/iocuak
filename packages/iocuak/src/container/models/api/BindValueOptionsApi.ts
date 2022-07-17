import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingTag } from '../../../binding/models/domain/BindingTag';

export interface BindValueOptionsApi {
  serviceId: ServiceId;
  tags?: BindingTag | BindingTag[];
  value: unknown;
}
