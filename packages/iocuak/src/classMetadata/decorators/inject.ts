import { ServiceId } from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataType,
  ClassElementServiceIdMetadata,
} from '@cuaklabs/iocuak-reflect-metadata-utils';

import { injectBase } from './injectBase';

export function inject(
  serviceId: ServiceId,
): ParameterDecorator & PropertyDecorator {
  return injectBase(serviceId, serviceIdToClassElementMatadata);
}

function serviceIdToClassElementMatadata(
  serviceId: ServiceId,
): ClassElementServiceIdMetadata {
  return {
    type: ClassElementMetadataType.serviceId,
    value: serviceId,
  };
}
