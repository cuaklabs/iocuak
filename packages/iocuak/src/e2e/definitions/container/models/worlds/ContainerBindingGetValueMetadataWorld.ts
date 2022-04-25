import { ValueServiceWorld } from '../../../common/models/worlds/ValueServiceWorld';
import { ContainerBindingGetMetadataWorld } from './ContainerBindingGetMetadataWorld';

export interface ContainerBindingGetValueMetadataWorld
  extends ContainerBindingGetMetadataWorld,
    ValueServiceWorld {}
