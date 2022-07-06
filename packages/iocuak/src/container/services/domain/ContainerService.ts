import { BindingService } from '../../../binding/services/domain/BindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: BindingService;
  metadata: MetadataService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
