import { ServiceId } from '@cuaklabs/iocuak-common';

import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadataApiType } from './ClassElementMetadatApiType';

export interface ClassElementServiceIdMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadataApiType.serviceId> {
  value: ServiceId;
}
