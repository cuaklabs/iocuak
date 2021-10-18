import { ContainerBindingService } from './ContainerBindingService';
import { ContainerMetadataService } from './ContainerMetadataService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  metadata: ContainerMetadataService;
  singleton: ContainerSingletonService;
}
