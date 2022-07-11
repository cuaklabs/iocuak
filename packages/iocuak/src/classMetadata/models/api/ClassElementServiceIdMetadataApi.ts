import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadataApiType } from './ClassElementMetadatApiType';

export interface ClassElementServiceIdMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadataApiType.serviceId> {
  value: ServiceId;
}
