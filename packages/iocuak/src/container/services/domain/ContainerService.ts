import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerBindingService } from './ContainerBindingService';
import { ContainerInstanceService } from './ContainerInstanceService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  instance: ContainerInstanceService;
  metadata: MetadataService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
