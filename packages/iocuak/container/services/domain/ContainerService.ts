import { ContainerBindingService } from './ContainerBindingService';
import { ContainerInstanceService } from './ContainerInstanceService';
import { ContainerMetadataService } from './ContainerMetadataService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  instance: ContainerInstanceService;
  metadata: ContainerMetadataService;
  singleton: ContainerSingletonService;
}
