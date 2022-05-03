import { BindingService } from '../../../binding/services/domain/BindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerInstanceService } from './ContainerInstanceService';
import { ContainerModuleService } from './ContainerModuleService';
import { ContainerRequestService } from './ContainerRequestService';
import { ContainerSingletonService } from './ContainerSingletonService';

export interface ContainerService {
  binding: BindingService;
  instance: ContainerInstanceService;
  metadata: MetadataService;
  module: ContainerModuleService;
  request: ContainerRequestService;
  singleton: ContainerSingletonService;
}
