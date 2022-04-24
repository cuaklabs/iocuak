import { ServiceId } from '../../../../../common/models/domain/ServiceId';
import { ContainerBindingGetMetadataWorld } from './ContainerBindingGetMetadataWorld';

export interface ContainerBindingGetValueMetadataWorld
  extends ContainerBindingGetMetadataWorld {
  serviceId: ServiceId;
  valueService: unknown;
}
