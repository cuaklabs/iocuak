import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerBindingService } from './ContainerBindingService';
import { ContainerInstanceService } from './ContainerInstanceService';
import { ContainerModuleService } from './ContainerModuleService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: ContainerBindingService;
  instance: ContainerInstanceService;
  metadata: MetadataService;
  module: ContainerModuleService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
