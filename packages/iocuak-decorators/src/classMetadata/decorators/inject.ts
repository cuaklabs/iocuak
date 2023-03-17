import { ServiceId } from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataType,
  ClassElementServiceIdMetadata,
} from '@cuaklabs/iocuak-models';

import { ParameterOrPropertyDecorator } from '../../common/models/ParameterOrPropertyDecorator';
import { injectBase } from './injectBase';

export function inject(serviceId: ServiceId): ParameterOrPropertyDecorator {
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
