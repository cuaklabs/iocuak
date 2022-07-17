import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

export interface BindValueOptionsApi {
  serviceId: ServiceId;
  tags?: Tag | Tag[];
  value: unknown;
}
