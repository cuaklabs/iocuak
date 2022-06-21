import { ServiceId } from '../../common/models/domain/ServiceId';
import { ClassElementMetadataType } from '../models/domain/ClassElementMetadataType';
import { ClassElementServiceIdMetadata } from '../models/domain/ClassElementServiceIdMetadata';
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
