import { ServiceId } from '@cuaklabs/iocuak-common';

import { BaseClassElementMetadata } from './BaseClassElementMetadata';
import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementServiceIdMetadata
  extends BaseClassElementMetadata<ClassElementMetadataType.serviceId> {
  value: ServiceId;
}
