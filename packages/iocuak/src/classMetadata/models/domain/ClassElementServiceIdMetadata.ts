import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ClassElementMetadataBase } from './ClassElementMetadataBase';
import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementServiceIdMetadata
  extends ClassElementMetadataBase<ClassElementMetadataType.serviceId> {
  value: ServiceId;
}
