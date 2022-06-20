import { ServiceId } from '../../../common/models/domain/ServiceId';
import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadatApiType } from './ClassElementMetadatApiType';

export interface ClassElementServiceIdMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadatApiType.serviceId> {
  value: ServiceId;
}
