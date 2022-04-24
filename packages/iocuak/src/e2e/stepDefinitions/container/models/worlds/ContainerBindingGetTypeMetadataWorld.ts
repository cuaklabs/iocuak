import { Newable } from '../../../../../common/models/domain/Newable';
import { ContainerBindingGetMetadataWorld } from './ContainerBindingGetMetadataWorld';

export interface ContainerBindingGetTypeMetadataWorld
  extends ContainerBindingGetMetadataWorld {
  typeService: Newable;
}
