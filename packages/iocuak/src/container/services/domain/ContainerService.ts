import { ContainerBindingService } from './ContainerBindingService';
import { ContainerInstanceService } from './ContainerInstanceService';
import { ContainerMetadataService } from './ContainerMetadataService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  instance: ContainerInstanceService;
  metadata: ContainerMetadataService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
